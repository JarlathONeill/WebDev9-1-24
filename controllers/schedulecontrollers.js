const conn = require('./../utils/dbconn');

exports.getSchedule = (req, res) => {
    const selectSQL = 'SELECT * FROM emotiondata';
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.render('index', { schedule: rows});
        }
    });
};

exports.getAddNewRun =  (req, res) => {
    res.render('addsnapshot');
    console.log(req.body);
};

exports.getRegister = (req, res) => {
    res.render('register');
}


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

exports.postNewUser = (req, res) => {
    const { email, password} = req.body;
    const vals = [email, password];
    console.log(vals);

    const insertSQL = 'INSERT into user (email, password) VALUES (?, ?)';

    conn.query(insertSQL, vals, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/');
        }
    });
}


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