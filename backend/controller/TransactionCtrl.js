const Transaction = require("../models/Transaction");

exports.getTransactionsByProvider = async (req, res) => {
  try {
    const transactions = await Transaction.find({ providerId: req.params.providerId });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
