const conn = require('./../utils/dbconn');

exports.getHome = (req, res) => {
    const { isloggedin } = req.session;
    console.log(`User logged in: ${isloggedin}`);

    res.render('index', { loggedin: isloggedin });
};

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
            return res.render('register', { loggedin: isloggedin, regError: true, message: message });
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

exports.getLogin = (req, res) => {
    var logError = false;
    const session = req.session;
    console.log(session);

    const { isloggedin } = req.session;
    console.log(`User logged in: ${isloggedin}`);

    res.render('login', { loggedin: isloggedin, logError: logError });
};


exports.postLogin = (req, res) => {
    const session = req.session;
    console.log(session);

    const { email, userpass } = req.body;
    const vals = [email, userpass];
    console.log(vals);

    const checkuserSQL = `SELECT user_id, email, password 
    FROM user 
    WHERE user.email = '${email}' AND user.password = '${userpass}'`;

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
            //res.render('login', { logError: true, message: "Successfully logged in" });
            res.redirect('/dashboard');
        } else {
            //res.redirect('/');
            res.render('login', { loggedin: false, logError: true, message: "Incorrect email or password" });
        }
    });
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
            if (err) throw err;

            var countenjoyment = 0;
            var countsadness = 0;
            var countanger = 0;
            var countcontempt = 0;
            var countdisgust = 0;
            var countfear = 0;
            var countsurprise = 0;

            rows.forEach((row) => {
                countenjoyment += row.enjoyment;
                countsadness += row.sadness;
                countanger += row.anger;
                countcontempt += row.contempt;
                countdisgust += row.disgust;
                countfear += row.fear;
                countsurprise += row.surprise;
            })

            const counts = [countenjoyment, countsadness, countanger, countcontempt, countdisgust, countfear, countsurprise];
            console.log(counts);
            res.render('dashboard', { data: counts, records: rows, loggedin: isloggedin, user: userinfo });
        });
    }
};
















exports.getNewSnap = (req, res) => {
    const session = req.session;
    
    console.log(session);

    const { isloggedin, userid } = req.session;

    //const { isloggedin } = req.session;
    console.log(`User logged in: ${isloggedin}`);

    res.render('addsnapshot', { loggedin: isloggedin });
};









exports.postNewSnap = (req, res) => {
    const { isloggedin, userid } = req.session;

    const { enjoyment, sadness, anger, contempt, disgust,
        fear, surprise, context, datetimerecord } = req.body;
    
    const vals = [ enjoyment, sadness, anger, contempt, disgust, fear, surprise, context, datetimerecord, userid ];

    const insertSQL = 'INSERT INTO emotiondata (enjoyment, sadness, anger, contempt, disgust, fear, surprise, context_trigger, date_time_record, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    conn.query(insertSQL, vals, (err, results) => {
        if (err) {
            throw err;
        } else {
            res.redirect('dashboard');
        }
    });
    console.log(req.body);
};

exports.selectSnapshot = (req, res) => {
    const session = req.session;
    
    console.log(session);

    const { isloggedin, userid } = req.session;

    const { id } = req.params;

    console.log(isloggedin);

    const selectSQL = `SELECT * FROM emotiondata WHERE emotion_data_id = ${id}`;
    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.log(rows);
            res.render('editsnapshot', {loggedin: isloggedin, details: rows});
        }
    });
};




exports.updateSnapshot = (req, res) => {

    const session = req.session;
    const { isloggedin, userid } = req.session;

    const { id } = req.params;

    //const emotion_data_id = req.params.snapshotid;  
    const { context} = req.body;
    const vals = [context];
    console.log(vals);

    const updateSQL = `UPDATE emotiondata SET context_trigger = ? WHERE emotion_data_id = ${id}`;
    conn.query(updateSQL, vals, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/dashboard');
        }
    });
};


exports.deleteSnapshot = (req, res) => {
    //const run_id = req.params.id;

    const { id } = req.params;

    const deleteSQL = `DELETE  FROM emotiondata WHERE emotion_data_id = ${id}`;
    conn.query(deleteSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/dashboard');
        }
    });
};

exports.getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};