const express = require('express');
const {
    createFeedback,
    getAllFeedback,
    getFeedbackByTeam
} = require('../controller/feedbackController');

const router = express.Router();

router.post('/', createFeedback);
router.get('/', getAllFeedback);
router.get('/team/:teamId', getFeedbackByTeam);

module.exports = router;