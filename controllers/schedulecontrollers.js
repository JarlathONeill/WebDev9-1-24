const axios = require('axios');
const bcrypt = require('bcrypt');

exports.getHome = (req, res) => {
    const { isloggedin } = req.session;

    res.render('index', { loggedin: isloggedin });
};

exports.getRegister = (req, res) => {
    var message = "Something went wrong";
    var regError = false;
    const session = req.session;

    const { isloggedin } = req.session;


    res.render('register', { loggedin: isloggedin, regError: regError });
    
};

exports.postRegister = async (req, res) => {
    var message = "";

    //deconstructing and getting user info from registration input
    const vals = { firstname, lastname, email, userpass } = req.body;

    const endpoint = `http://localhost:3002/users/register`;

    await axios
        .post(endpoint, vals, {maxRedirects: 0})
        .then((response) => {
            const data = response.data;
            const status = response.status;

            if (status === 200) {
                const userId = data.result.insertId;
                req.session.isloggedin = true;
                req.session.userid = userId;
                res.redirect('/dashboard');
                
            } else {
                console.log(data.result);
                req.session.isloggedin = false;
                message = data.message;
                res.render('register', {loggedin: false, regError: true, message: message});
            }
        })
        
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        });
};


exports.getLogin = (req, res) => {
    var logError = false;
    const session = req.session;

    const { isloggedin } = req.session;

    res.render('login', { loggedin: isloggedin, logError: logError });
};


exports.postLogin = async (req, res) => {

    const vals = { email, userpass } = req.body;

    const endpoint = `http://localhost:3002/users/login`;

    await axios
        .post(endpoint, vals, { validateStatus: (status) => {return status < 500 } })
        .then((response) => {
            const status = response.status;
            if (status === 200) {
                const data = response.data.result;

                const session = req.session;
                session.isloggedin = true;
                session.userid = data[0].user_id;

                res.redirect('/dashboard');
            } else {
                res.render('login', { loggedin: false, logError: true, message: "Incorrect email or password" });

            }
        })
};

exports.getDashboard = async (req, res) => {
    var userinfo = {};

    const { isloggedin, userid } = req.session;

    if (isloggedin) {

        const endpoint1 = `http://localhost:3002/users/${userid}`;
        axios
            .get(endpoint1)
            .then((response) => {
                const data = response.data.result;
                const username = data[0].first_name;

                const session = req.session;
                session.name = username;

                userinfo = { name: username };

            })
            .catch((error) => {
                console.log(`Error making API request: ${error}`);
            });


        const endpoint2 = `http://localhost:3002/snapshot/getdashboard`;
        axios
            .get(endpoint2)
            .then((response) => {
                const data = response.data.result;
                const newData = [];

                for (i = 0; i < data.length; i++) {
                    if (data[i].user_id === userid) {
                        newData.push(data[i]);
                    }
                }

                var countenjoyment = countsadness = countanger = countcontempt = countdisgust = countfear = countsurprise = 0;

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

                res.render('dashboard', { data: counts, records: newData, loggedin: isloggedin, user: userinfo });
            })
            .catch((error) => {
                console.log(`Error making API request: ${error}`);
            });

    }
};



exports.getNewSnap = (req, res) => {
    const session = req.session;

    const { isloggedin, userid } = req.session;

    res.render('addsnapshot', { loggedin: isloggedin });
};



exports.postNewSnap = async (req, res) => {
    const login = { isloggedin, userid } = req.session;

    const vals = {
        enjoyment, sadness, anger, contempt, disgust, fear,
        surprise, context, datetimerecord
    } = req.body;

    const endpoint = `http://localhost:3002/snapshot/addsnapshot`;

    //ChatGPT helped with adding in the values to pass from Axios to http://localhost:3002/snapshot/addsnapshot
    await axios
        .post(endpoint, { enjoyment, sadness, anger, contempt, disgust, fear, surprise, context, datetimerecord, userid })
        .then((response) => {
            const data = response.data;
            res.redirect('/dashboard');
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        })
};


exports.selectSnapshot = (req, res) => {
    const session = req.session;

    const { isloggedin, userid } = req.session;

    const { id } = req.params;

    const endpoint = `http://localhost:3002/snapshot/selectsnapshot/${id}`;

    const config = { validateStatus: (status) => { return status < 500 } };

    axios
        .get(endpoint, config)
        .then((response) => {
            const data = response.data.result;
            res.render('editsnapshot', { loggedin: isloggedin, details: data });
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        });
};




exports.updateSnapshot = async (req, res) => {

    const session = req.session;
    const { isloggedin, userid } = req.session;

    const { id } = req.params;

    const { context } = req.body;
    const vals = { context, id };

    const endpoint = `http://localhost:3002/snapshot/updatesnapshot/${id}`;

    await axios
        .put(endpoint, vals)
        .then((response) => {

            res.redirect('/dashboard');
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        });

};


exports.deleteSnapshot = async (req, res) => {

    const { id } = req.params;

    const endpoint = `http://localhost:3002/snapshot/deletesnapshot/${id}`;

    await axios
        .delete(endpoint)
        .then((response) => {

            res.redirect('/dashboard');
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`)
        });
};


exports.getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};