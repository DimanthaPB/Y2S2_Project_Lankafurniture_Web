// Routes/projectRoute.js
const express = require("express");
const router = express.Router();
const ProjectCtrl = require("../controller/ProjectCtrl");

// Get project by ID
router.get("/id/:id", ProjectCtrl.getProjectById);

// Get projects by provider
router.get("/provider/:providerId", ProjectCtrl.getProjectsByProvider);

// Create new project
router.post("/", ProjectCtrl.createProject);

// Update project (title/category/status)
router.put("/:id", ProjectCtrl.updateProject);

// Delete project
router.delete("/:id", ProjectCtrl.deleteProject);

module.exports = router;
