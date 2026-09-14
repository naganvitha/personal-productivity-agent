const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/today', scheduleController.getTodaySchedule);
router.post('/generate', scheduleController.generateSchedule);

module.exports = router;
