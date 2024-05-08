const mongoose = require('mongoose');

const sportSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
});

const Sport = mongoose.model('Sport', sportSchema);

module.exports = Sport;
