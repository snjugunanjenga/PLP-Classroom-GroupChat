const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  groupId: { type: String, required: true, unique: true, default: () => Math.random().toString(36).substr(2, 8) }, // Short unique ID
});

module.exports = mongoose.model('Group', groupSchema);