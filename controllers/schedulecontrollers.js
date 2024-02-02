const conn = require('./../utils/dbconn');

exports.getHome = (req, res) => {
    const { isloggedin } = req.session;
    console.log(`User logged in: ${isloggedin}`);

    res.render('index', { loggedin: isloggedin });


};

exports.getDashboard = (req, res) => {
    var userinfo = {};

    //const session = req.session;
    //console.log(session);

    const { isloggedin, userid } = req.session;
    console.log(`User logged in: ${isloggedin}, ${userid}`);


    if (isloggedin) {
        const getuserSQL = `SELECT user.first_name
        FROM user
        WHERE user.user_id = '${userid}'`;

        conn.query(getuserSQL, (err, rows) => {

            if (err) throw err;

            console.log(rows);
            const username = rows[0].first_name;
            const session = req.session;
            session.name = username;
            userinfo = { name: username };
            console.log(userinfo);


        });



        const selectSQL = `SELECT * FROM emotiondata WHERE emotiondata.user_id = ${userid}`;
        conn.query(selectSQL, (err, rows) => {
            if (err) {
                throw err;
            } else {
                res.render('dashboard', { records: rows, loggedin: isloggedin, user: userinfo });
            }
        });
    };


}


exports.getRegister = (req, res) => {
    const session = req.session;
    console.log(session);

    const { isloggedin } = req.session;
    console.log(`User logged in: ${isloggedin}`);

    res.render('register', { loggedin: isloggedin });
};

exports.postRegister = (req, res) => {
    const session = req.session;
    //const { isloggedin } = req.session;
    const isloggedin = false;
    //res.render('register', { loggedin: isloggedin });




    const { firstname, lastname, email, userpass } = req.body;
    const vals = [firstname, lastname, email, userpass];
    
    const novals = "Please enter your first name, last name, email and password";


    const insertSQL = 'INSERT into user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';

    if (!firstname || !lastname || !email || !userpass) return res.render('register', {loggedin: false, error: vals });

   //if (!firstname || !lastname || !email || !userpass) return res.json({ error: "Please enter your first name, last name, email and password" });

    else {

        conn.query(insertSQL, vals, async (err, rows) => {
            if (err) throw err;
            //console.log(vals);

            res.redirect('login');

        });

        const session = req.session;
        console.log(session);

    };

    //if (!email || !password) return res.json({ status: "error", error: "Please enter your email and password" });

    /*
    else {
        console.log(email);

        conn.query(insertSQL, vals, async (err, rows) => {
            if (err) {
                throw err;
            } else if (result[0]) {
                return res.json({ status: "error", error: "Email has already been registered" })
            }
            else {
                res.redirect('/');
            }
        });
    }*/
};



exports.getLogin = (req, res) => {
    const session = req.session;
    console.log(session);

    const { isloggedin } = req.session;
    console.log(`User logged in: ${isloggedin}`);

    res.render('login', { loggedin: isloggedin });
};


exports.postLogin = (req, res) => {
    const session = req.session;
    console.log(session);

    const { email, userpass } = req.body;
    const vals = [email, userpass];
    console.log(vals);

    const checkuserSQL = `SELECT user_id FROM user WHERE user.email = '${email}'`;

    conn.query(checkuserSQL, vals, (err, rows) => {
        if (err) throw err;

        const numrows = rows.length;
        console.log(numrows);

        if (numrows > 0) {
            console.log(rows);
            const session = req.session;
            session.isloggedin = true;
            session.userid = rows[0].user_id;
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





exports.getAddNewRun = (req, res) => {
    res.render('addsnapshot');
    console.log(req.body);
};




exports.selectRun = (req, res) => {
    const { id } = req.params;

    const selectSQL = `SELECT * FROM runschedule WHERE id = ${id}`;
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.log(rows);
            res.render('editschedule', { details: rows });
        }
    });
};




exports.postNewRun = (req, res) => {
    const { new_context, new_date } = req.body;
    const vals = [new_context, new_date];

    const insertSQL = 'INSERT INTO emotiondata (context_trigger, date_time_record) VALUES (?, ?)';

    conn.query(insertSQL, vals, (err, results) => {
        if (err) {
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
    const vals = [run_details, run_date, run_id];
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