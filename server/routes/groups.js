const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const { authMiddleware } = require('../utils/jwt');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const group = new Group({ name, members: [req.user.id] });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;