const express = require("express");
const router = express.Router();
const TransactionCtrl = require("../controller/TransactionCtrl");

router.get("/:providerId", TransactionCtrl.getTransactionsByProvider);

module.exports = router;
