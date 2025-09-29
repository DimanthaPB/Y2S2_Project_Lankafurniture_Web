const express = require("express");
const router = express.Router();
const Rating = require("../models/Rating");

// Get ratings by provider
router.get("/provider/:providerId", async (req, res) => {
  try {
    const ratings = await Rating.find({ providerId: req.params.providerId });
    res.status(200).json(ratings);
  } catch (err) {
    console.error('Error fetching ratings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add other rating routes as needed

module.exports = router;
