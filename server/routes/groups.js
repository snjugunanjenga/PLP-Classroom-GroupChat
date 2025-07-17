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
    const group = new Group({ name, members: [req.user.id], admin: req.user.id });
    await group.save();
    res.status(201).json(group); // group now includes groupId
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/unread-counts', authMiddleware, async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id });
    const counts = {};
    for (const group of groups) {
      counts[group._id] = await require('../models/Message').countDocuments({ group: group._id, unreadBy: req.user.id });
    }
    res.json(counts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = await Group.findOne({ groupId });
    if (!group) return res.status(404).json({ message: 'Group not found' });
    let joined = false;
    if (!group.members.includes(req.user.id)) {
      group.members.push(req.user.id);
      await group.save();
      joined = true;
    }
    // Emit socket event to the user if joined
    if (joined) {
      const io = req.app.get('io');
      if (io && io.userSockets && io.userSockets[req.user.id]) {
        io.to(io.userSockets[req.user.id]).emit('joined group notification', { group });
      }
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:groupId/join', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (!group.members.includes(req.user.id)) {
      group.members.push(req.user.id);
      await group.save();
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:groupId/leave', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    group.members = group.members.filter(id => id.toString() !== req.user.id);
    await group.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin removes a member
router.post('/:groupId/remove-member', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.admin.toString() !== req.user.id) return res.status(403).json({ message: 'Only admin can remove members' });
    group.members = group.members.filter(id => id.toString() !== req.body.userId);
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin transfers admin rights
router.post('/:groupId/transfer-admin', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found' });
    if (group.admin.toString() !== req.user.id) return res.status(403).json({ message: 'Only admin can transfer admin rights' });
    if (!group.members.includes(req.body.userId)) return res.status(400).json({ message: 'User must be a group member' });
    group.admin = req.body.userId;
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
module.exports.groupsRouter = router;