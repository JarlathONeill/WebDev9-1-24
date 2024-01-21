const conn = require('./../utils/dbconn');

exports.getHome = (req, res) => {

    const session = req.session;
    console.log(session);

    const { isloggedin } = req.session;
    console.log(`USer logged in: ${isloggedin}`);

    const selectSQL = 'SELECT * FROM emotiondata';
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render('index', { schedule: rows, loggedin: isloggedin});
        }
    });
};

exports.getRegister = (req, res) => {
    const session = req.session;
    console.log(session);

    const { isloggedin } = req.session;
    console.log(`USer logged in: ${isloggedin}`);

    res.render('register', { loggedin: isloggedin});
};

exports.postRegister = (req, res) => {
    const { user_id, email, password} = req.body;
    const vals = [user_id, email, password];
    console.log(vals);

    const insertSQL = 'INSERT into user (user_id, email, password) VALUES (NULL, ?, ?)';

    conn.query(insertSQL, vals, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/');
        }
    });
};



exports.getLogin = (req, res) => {
    const session = req.session;
    console.log(session);

    const { isloggedin } = req.session;
    console.log(`USer logged in: ${isloggedin}`);

    res.render('login', { loggedin: isloggedin });
};

exports.postLogin = (req, res) => {
    const session = req.session;
    console.log(session);

    const { email, userpass } = req.body;
    const vals = [ email, userpass ];
    console.log(vals);

    const checkuserSQL = `SELECT * FROM user WHERE email = ? AND password = ?`;

    conn.query( checkuserSQL, vals, (err, rows) => {
        if (err) throw err;

        const numrows = rows.length;
        console.log(numrows); 
        if (numrows > 0) {
            console.log(rows);
            const session = req.session;
            session.isloggedin = true;
            console.log(session);
            res.redirect('/');
        } else {
            res.redirect('/');
        }
    });
};

exports.getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};





exports.getAddNewRun =  (req, res) => {
    res.render('addsnapshot');
    console.log(req.body);
};




exports.selectRun =  (req, res) => {
    const { id } = req.params;

    const selectSQL = `SELECT * FROM runschedule WHERE id = ${id}`;
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.log(rows);
            res.render('editschedule', { details: rows});
        }
    });
};




exports.postNewRun = (req, res) => {
    const { new_context, new_date } = req.body;
    const vals = [new_context, new_date];

    const insertSQL = 'INSERT INTO emotiondata (context_trigger, date_time_record) VALUES (?, ?)';

    conn.query(insertSQL, vals, (err, results) => {
        if(err) {
            throw err;
        } else {
            res.redirect('/');
        }
    });
    console.log(req.body);
};


exports.updateRun = (req, res) => {
    //console.log(req.params);
    //console.log(req.body);

    const run_id = req.params.id;
    const { run_details, run_date } = req.body;
    const vals = [ run_details, run_date, run_id ];
    console.log(vals);

    const updateSQL = 'UPDATE runschedule SET items = ?, mydate = ? WHERE id = ?';
    conn.query(updateSQL, vals, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/');
        }
    });
};


exports.deleteRun = (req, res) => {
    const run_id = req.params.id;

    const deleteSQL = `DELETE FROM runschedule WHERE id = ${run_id}`;
    conn.query(deleteSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/');
        }
    });
};