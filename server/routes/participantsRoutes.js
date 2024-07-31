const express = require('express');
const router = express.Router();
const participantsController = require('../controllers/participantsController');

router.get('/', participantsController.searchParticipants);
router.get('/all', participantsController.getAllParticipants);
router.post('/new', participantsController.addParticipant);

module.exports = router;
