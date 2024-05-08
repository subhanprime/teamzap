const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    creativeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    athleteId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    ratingPoint: { type: Number, default: 0 },
    feedback: { type: String, default: null }
}, { timestamps: true });

const Ratings = mongoose.model('ratings', ratingSchema);

module.exports = Ratings;
