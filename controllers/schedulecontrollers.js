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
    var regError = false;
    const session = req.session;
    console.log(session);

    const { isloggedin } = req.session;
    console.log(`User logged in: ${isloggedin}`);

    res.render('register', { loggedin: isloggedin, regError: regError });
};

exports.postRegister = (req, res) => {
    var message = "";

    const session = req.session;
    const { isloggedin } = req.session;

    //deconstructing and getting user info from registration input
    const { firstname, lastname, email, userpass } = req.body;
    const vals = [firstname, lastname, email, userpass];

    //variable for error message
    const nodata = "Please enter your first name, last name, email and password";

    //SQL to be used
    const checkdetailsSQL = `SELECT * FROM user WHERE email = '${email}'`;
    const insertSQL = 'INSERT into user (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';


    conn.query(checkdetailsSQL, [email], async (err, result) => {
        if (err) throw err;

        //check if user has missed any input boxes
        if (!firstname || !lastname || !email || !userpass) {
            message = "Please enter your first name, last name, email and password";
            return res.render('register', { loggedin: isloggedin, regError: true, message: message});
            //return res.status(400).send('Please enter your first name, last name, email and password');
        } else if (result.length > 0) {
            //return res.render('register', { loggedin: isloggedin, errmsg: "email already in use" });
            message = 'Email has already been registered';
            return res.render('register', { loggedin: isloggedin, regError: true, message: message });
        } else {
            conn.query(insertSQL, vals, async (err, rows) => {
                if (err) throw err;
                //console.log(vals);

                res.redirect('login');
            });
        };
    });
};






//if (!firstname || !lastname || !email || !userpass) return res.render('register', {loggedin: false, error: vals });

//if (!firstname || !lastname || !email || !userpass) return res.json({ error: "Please enter your first name, last name, email and password" });

// else {






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
//};



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





exports.getNewSnap = (req, res) => {
    const session = req.session;
    console.log(session);

    const { isloggedin } = req.session;
    console.log(`User logged in: ${isloggedin}`);

    res.render('addsnapshot', { loggedin: isloggedin });
};



/*
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
*/



exports.postNewSnap = (req, res) => {
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