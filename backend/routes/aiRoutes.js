const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/chat', aiController.handleChat);
router.get('/insights', aiController.getInsights);
router.post('/recalculate', aiController.recalculateAgentPlan);

module.exports = router;
