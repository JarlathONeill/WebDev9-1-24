const express = require('express');
const controller = require('./../controllers/schedulecontrollers');
const conn = require('../utils/dbconn');
const router = express.Router();

router.get('/', controller.getHome);
//router.get('/new', controller.getAddNewRun);
router.get('/register', controller.getRegister);
//router.get('/edit/:id', controller.selectRun);
router.get('/login', controller.getLogin);
router.get('/logout', controller.getLogout);
router.get('/dashboard', controller.getDashboard);
router.get('/addsnapshot', controller.getNewSnap);



//router.post('/new', controller.postNewRun);
//router.post('/edit/:id', controller.updateRun);
//router.post('/del/:id', controller.deleteRun);
router.post('/register', controller.postRegister);
router.post('/login', controller.postLogin);
router.post('/addsnapshot', controller.postNewSnap);

module.exports = router;