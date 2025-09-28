const express = require("express");
const router = express.Router();
const jobCtrl = require("../controller/jobCtrl");

router.post("/", jobCtrl.createJob);    // Create new job

// Get latest jobs (new arrivals)
router.get("/new", jobCtrl.getNewJobs);

// Get all jobs
router.get("/", jobCtrl.getAllJobs);

// Get single job by ID
router.get("/:id", jobCtrl.getJobById);

module.exports = router;