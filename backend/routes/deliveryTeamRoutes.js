const express = require('express');
const {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
} = require('../controller/deliveryTeamController');

const router = express.Router();

router.post('/', createTeam);
router.get('/', getTeams);
router.get('/:id', getTeamById);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

module.exports = router;