const conn = require('./../utils/dbconn');
const axios = require('axios');
const { get } = require('../utils/fetch')

exports.getHome = (req, res) => {
    const { isloggedin } = req.session;
    //console.log(`User logged in: ${isloggedin}`);

    res.render('index', { loggedin: isloggedin });
};

exports.getRegister = (req, res) => {
    var regError = false;
    const session = req.session;
    //console.log(session);

    const { isloggedin } = req.session;
    //console.log(`User logged in: ${isloggedin}`);

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
    //console.log(session);

    const { isloggedin } = req.session;
    //console.log(`User logged in: ${isloggedin}`);

    res.render('login', { loggedin: isloggedin, logError: logError });
};


exports.postLogin = (req, res) => {
    const session = req.session;
    //console.log(session);

    const { email, userpass } = req.body;
    const vals = [email, userpass];
    //console.log(vals);

    const checkuserSQL = `SELECT user_id, email, password 
    FROM user 
    WHERE user.email = '${email}' AND user.password = '${userpass}'`;

    conn.query(checkuserSQL, vals, (err, rows) => {
        if (err) throw err;

        const numrows = rows.length;
        //console.log(numrows);

        if (numrows > 0) {
            //console.log(rows);
            const session = req.session;
            session.isloggedin = true;
            session.userid = rows[0].user_id;
            //console.log(session);
            //res.render('login', { logError: true, message: "Successfully logged in" });
            res.redirect('/dashboard');
        } else {
            //res.redirect('/');
            res.render('login', { loggedin: false, logError: true, message: "Incorrect email or password" });
        }
    });
};

exports.getDashboard = async (req, res) => {
    var userinfo = {};

    //const session = req.session;
    //console.log(session);

    const { isloggedin, userid } = req.session;
    console.log(`User logged in: ${isloggedin}, ${userid}`);


    if (isloggedin) {

        const endpoint1 = `http://localhost:3002/users/${userid}`;

        axios
            .get(endpoint1)
            .then((response) => {
                const data = response.data.result;
                console.log(`new endpoint data: ${data}`);
                const username = data[0].first_name;

                const session = req.session;
                session.name = username;
                console.log(session);

                userinfo = {name: username};
                console.log(userinfo)

            })
            .catch((error) => {
                console.log(`Error making API request: ${error}`);
            });
                

                // for (i=0; i < data.length; i++) {
                //     if (data[i].user_id === userid) {

                //         userData.push(data[i]);
                        
                        

                //         // const username = data[i].first_name;
                //         // console.log(`>>>>>>>>>>>>DATA.USERNAME: ${data[i].first_name}`);
                //         // const session = req.session;
                        
                //         // session.name = username;
                //         // console.log(session.name);
                //         // userinfo = { name: username };
                //     }
                // }

                
                //console.log(`>>>>>>>>>>>>USERNAME: ${username}`);





                // if (userid === data.user_id) {
                //     console.log(`>>>>>>>>>>>>USERNAME: ${data.user_id}`);
                //     const username = data.first_name;
                //     const session = req.session;
                //     session.name = username;
                //     userinfo = { name: username };

                // }
                    




        // const getuserSQL = `SELECT user.first_name FROM user WHERE user.first_name = ${userid}`;
        // conn.query(getuserSQL, (err, rows) => {

        //     if (err) throw err;

        //     //console.log(rows);
        //     const username = rows[0].first_name;
        //     const session = req.session;
        //     session.name = username;
        //     userinfo = { name: username };
        //     //console.log(userinfo);


        // });

        const endpoint2 = `http://localhost:3002/snapshot/getdashboard`;

        axios
            .get(endpoint2)
            .then((response) => {
                const data = response.data.result;
                const newData = [];

                for (i=0; i < data.length; i++) {
                    if (data[i].user_id === userid) {
                        newData.push(data[i]);
                    }
                }

                



                var countenjoyment = countsadness = countanger = countcontempt = countdisgust = countfear = countsurprise = 0;
                //const headers = response.headers;
                
                newData.forEach((row) => {
                    countenjoyment += row.enjoyment;
                    countsadness += row.sadness;
                    countanger += row.anger;
                    countcontempt += row.contempt;
                    countdisgust += row.disgust;
                    countfear += row.fear;
                    countsurprise += row.surprise;
                })

                const counts = [countenjoyment, countsadness, countanger, countcontempt, countdisgust, countfear, countsurprise];

                res.render('dashboard', { data: counts, records: newData,  loggedin: isloggedin, user: userinfo });
            })
            .catch((error) => {
                console.log(`Error making API request: ${error}`);
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

    const vals = [enjoyment, sadness, anger, contempt, disgust, fear, surprise, context, datetimerecord, userid];

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

    //console.log(session);

    const { isloggedin, userid } = req.session;

    const { id } = req.params;

    //console.log(isloggedin);

    // const selectSQL = `SELECT * FROM emotiondata WHERE emotion_data_id = ${id}`;
    // conn.query(selectSQL, (err, rows) => {
    //     if (err) {
    //         throw err;
    //     } else {
    //         console.log(rows);
    //         res.render('editsnapshot', { loggedin: isloggedin, details: rows });
    //     }
    // });

    const endpoint = `http://localhost:3002/snapshot/selectsnapshot/${id}`;

    const config = { validateStatus: (status) => { return status < 500 } };

    axios
        .get(endpoint, config)
        .then((response) => {
            const data = response.data.result;
            console.log('Promise resolved!');
            console.log(response.data);
            res.render('editsnapshot', { loggedin: isloggedin, details: data });
        })
        .catch((error) => {
            console.log('Promise rejected!');
            console.log(error.response);
        });










};




exports.updateSnapshot = async (req, res) => {

    const session = req.session;
    const { isloggedin, userid } = req.session;

    const { id } = req.params;

    //const emotion_data_id = req.params.snapshotid;  
    const { context } = req.body;
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

    const endpoint = `http://localhost:3002/snapshot/updatesnapshot/:${id}`;

    axios
        .put(endpoint, { validateStatus: (status) => { return status < 500 } })
        .then((response) => {
            const status = response.status;
            if (status === 200) {
                res.redirect('');
            } else {
                console.log(response.status);
                console.log(response.data);
                res.redirect('');
            }
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
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