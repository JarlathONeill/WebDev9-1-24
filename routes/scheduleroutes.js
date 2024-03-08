const express = require('express');
const controller = require('./../controllers/schedulecontrollers');
const conn = require('../utils/dbconn');
const router = express.Router();

router.get('/', controller.getHome);
router.get('/register', controller.getRegister);
router.get('/editsnapshot/:id', controller.selectSnapshot);
router.get('/login', controller.getLogin);
router.get('/logout', controller.getLogout);
router.get('/dashboard', controller.getDashboard);
router.get('/addsnapshot', controller.getNewSnap);




router.post('/editsnapshot/:id', controller.updateSnapshot);
router.post('/deletesnapshot/:id', controller.deleteSnapshot);
router.post('/register', controller.postRegister);
router.post('/login', controller.postLogin);
router.post('/addsnapshot', controller.postNewSnap);


module.exports = router;    