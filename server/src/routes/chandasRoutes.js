const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/chandasController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/notes', getNotes);
router.get('/notes/:id', getNoteById);
router.post('/notes', protect, adminOnly, createNote);
router.put('/notes/:id', protect, adminOnly, updateNote);
router.delete('/notes/:id', protect, adminOnly, deleteNote);

module.exports = router;
