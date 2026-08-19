const asyncHandler = require('express-async-handler');
const ChandasNote = require('../models/ChandasNote');

// Fallback in-memory articles if MongoDB is unseeded or offline
const defaultNotes = [
  {
    _id: 'default-1',
    title: 'Ācārya Piṅgala & the Chandaḥśāstra',
    body: `Ācārya Piṅgala (c. 3rd–2nd century BCE) was an ancient Indian mathematician and grammarian who composed the **Chandaḥśāstra** ("Science of Sanskrit Meters"). In Chapter 8 of this seminal work, Piṅgala presented a systematic method for enumerating all possible combinations of **Laghu** (light, 1 mora, denoted as |) and **Guru** (heavy, 2 morae, denoted as ऽ) syllables in Sanskrit poetic meters.\n\nTo count how many meters of total length *n* contain exactly *r* heavy syllables, Piṅgala described a tabular expansion structure known as **Meru-Prastāra** ("Mount Meru Expansion"). This structure is mathematically identical to what was later known in Western mathematics as Pascal's Triangle (Blasie Pascal, 1655 CE) and in China as Yang Hui's Triangle (1261 CE), preceding both by over a millennium.`,
    category: 'history',
    author: 'TYCS IKSCS Research Team',
    publishedAt: new Date('2026-07-01')
  },
  {
    _id: 'default-2',
    title: 'Connecting Meru-Prastāra to Dynamic Programming & Memoization',
    body: `In modern Computer Science, computing binomial coefficients C(n,r) via naive recursion mirrors Piṅgala's combinatorial recurrence:\n\n$$\\text{C}(n,r) = \\text{C}(n-1, r-1) + \\text{C}(n-1, r)$$\n\nHowever, a naive recursive implementation evaluates identical subproblems repeatedly. For instance, calculating C(5,3) evaluates C(3,2) multiple times across separate tree branches, causing $O(2^n)$ exponential growth in execution time and stack space.\n\nBy introducing **Memoization** (Top-Down caching) or **Tabulation** (Bottom-Up table filling as in Meru-Prastāra's row-by-row construction), we eliminate all duplicate subproblem evaluations, reducing execution time to $O(n \\times r)$ linear space and time.`,
    category: 'method',
    author: 'TYCS IKSCS Research Team',
    publishedAt: new Date('2026-07-05')
  },
  {
    _id: 'default-3',
    title: 'Glossary of Indian Prosody (Chandaḥśāstra) & Combinatorics',
    body: `### Core Terminology:\n- **Meru-Prastāra**: "Expansion of Mount Meru" — the pyramid layout of binomial coefficients.\n- **Laghu (लघु)**: A short syllable having a duration of 1 matra (mora). Symbol: |\n- **Guru (गुरु)**: A long syllable having a duration of 2 matras. Symbol: ऽ\n- **Prastāra**: Systematic step-by-step permutation listing of all possible meter patterns.\n- **Saṅkhyā**: Direct formula computation for total combinations of meter length *n* ($2^n$).\n- **Naṣṭam & Uddiṣṭam**: Algorithms for finding the pattern given an index, and finding the index given a pattern.`,
    category: 'glossary',
    author: 'TYCS IKSCS Research Team',
    publishedAt: new Date('2026-07-10')
  }
];

// @desc    Get all Chandas historical articles
// @route   GET /api/chandas/notes
// @access  Public
const getNotes = asyncHandler(async (req, res) => {
  try {
    const notes = await ChandasNote.find().sort({ publishedAt: -1 });
    if (notes.length > 0) {
      return res.json({ success: true, count: notes.length, notes });
    }
  } catch (err) {
    // Fall through to default notes if DB error
  }

  res.json({ success: true, count: defaultNotes.length, notes: defaultNotes });
});

// @desc    Get single Chandas article by ID
// @route   GET /api/chandas/notes/:id
// @access  Public
const getNoteById = asyncHandler(async (req, res) => {
  try {
    const note = await ChandasNote.findById(req.params.id);
    if (note) {
      return res.json({ success: true, note });
    }
  } catch (err) {
    // Check fallback notes
  }

  const found = defaultNotes.find(n => n._id === req.params.id);
  if (found) {
    return res.json({ success: true, note: found });
  }

  res.status(404);
  throw new Error('Historical article not found.');
});

// @desc    Create new Chandas article (Admin only)
// @route   POST /api/chandas/notes
// @access  Private/Admin
const createNote = asyncHandler(async (req, res) => {
  const { title, body, category, author } = req.body;

  if (!title || !body) {
    res.status(400);
    throw new Error('Title and Body are required fields.');
  }

  try {
    const note = await ChandasNote.create({
      title,
      body,
      category: category || 'history',
      author: author || 'Admin'
    });
    res.status(201).json({ success: true, note });
  } catch (err) {
    res.status(500);
    throw new Error(`Failed to create note: ${err.message}`);
  }
});

// @desc    Update Chandas article (Admin only)
// @route   PUT /api/chandas/notes/:id
// @access  Private/Admin
const updateNote = asyncHandler(async (req, res) => {
  const { title, body, category, author } = req.body;

  try {
    const note = await ChandasNote.findById(req.params.id);
    if (note) {
      note.title = title || note.title;
      note.body = body || note.body;
      note.category = category || note.category;
      note.author = author || note.author;
      const updatedNote = await note.save();
      return res.json({ success: true, note: updatedNote });
    }
  } catch (err) {
    // Continue
  }

  res.status(404);
  throw new Error('Article not found or database unavailable');
});

// @desc    Delete Chandas article (Admin only)
// @route   DELETE /api/chandas/notes/:id
// @access  Private/Admin
const deleteNote = asyncHandler(async (req, res) => {
  try {
    const note = await ChandasNote.findById(req.params.id);
    if (note) {
      await note.deleteOne();
      return res.json({ success: true, message: 'Article deleted successfully' });
    }
  } catch (err) {
    // Continue
  }

  res.status(404);
  throw new Error('Article not found');
});

module.exports = {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};
