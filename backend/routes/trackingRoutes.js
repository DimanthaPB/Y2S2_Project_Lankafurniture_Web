const express = require('express');
const {
    createOrUpdateTracking,
    getTrackingByOrder,
    listTracking,
    deleteTracking
} = require('../controller/trackingController');

const router = express.Router();

router.post('/', createOrUpdateTracking);          // create/update by orderId
router.get('/', listTracking);                     // optional ?status=
router.get('/:orderId', getTrackingByOrder);       // for customer tracking view
router.delete('/:orderId', deleteTracking);

module.exports = router;