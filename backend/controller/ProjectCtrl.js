// Controlers/ProjectCtrl.js
const Project = require("../models/Project");

// ✅ Get Project by ID
exports.getProjectById = async (req, res) => {
  const id = req.params.id;
  console.log("Requested Project ID:", id);

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ project });
  } catch (err) {
    console.error("Error fetching project:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Get all projects for a provider
exports.getProjectsByProvider = async (req, res) => {
  try {
    const projects = await Project.find({ providerId: req.params.providerId });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Create new project
exports.createProject = async (req, res) => {
  const { providerId, title, description, category, status } = req.body;

  try {
    const payload = { providerId, title, description, category };
    if (status) payload.status = status; // optional: 'Ongoing' | 'Completed'
    const newProject = new Project(payload);
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update a project (title, category, status)
exports.updateProject = async (req, res) => {
  const id = req.params.id;
  const { title, category, status } = req.body;
  try {
    const update = {};
    if (title !== undefined) update.title = title;
    if (category !== undefined) update.category = category;
    if (status !== undefined) update.status = status; // expect 'Ongoing' | 'Completed'
    update.updatedAt = new Date();

    const updated = await Project.findByIdAndUpdate(id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete a project
exports.deleteProject = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

