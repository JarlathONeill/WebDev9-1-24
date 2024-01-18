const express = require('express');
const controller = require('./../controllers/schedulecontrollers');
const conn = require('../utils/dbconn');
const router = express.Router();

router.get('/', controller.getSchedule);
router.get('/new', controller.getAddNewRun);
router.get('/register', controller.getRegister);
router.get('/edit/:id', controller.selectRun);
router.post('/new', controller.postNewRun);
router.post('/edit/:id', controller.updateRun);
router.post('/del/:id', controller.deleteRun);
router.post('/register', controller.postNewUser);

module.exports = router;