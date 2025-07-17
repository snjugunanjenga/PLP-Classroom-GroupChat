const mongoose = require('mongoose');
const Group = require('./models/Group');

async function migrate() {
  await mongoose.connect('mongodb://localhost:27017/classroom-chat');
  const groups = await Group.find({ groupId: { $exists: false } });
  for (const group of groups) {
    if (!group.admin) {
      console.warn(`Skipping group ${group._id}: missing admin field.`);
      continue;
    }
    group.groupId = Math.random().toString(36).substr(2, 8);
    await group.save();
    console.log(`Updated group ${group._id} with groupId ${group.groupId}`);
  }
  console.log('Migration complete');
  await mongoose.disconnect();
}

migrate().catch(err => { console.error(err); process.exit(1); }); 