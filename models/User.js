const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  uuid: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['athlete', 'creative'], required: true },
  refreshToken: { type: String, },
  profile: {
    firstName: String,
    lastName: String,
    fullName: String,
    profilePicture: String,
    location: String,
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    sports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sport' }],
    // bio: {type:String,default:""},
    hourlyRate: { type: Number, default: 0 },
    location: { type: String, default: "" },
    biography: { type: String, default: "" },
    title: { type: String, default: "" },
    avatar: { type: String, default: "" },
    ratePerHour: { type: Number, default: 0 }
  },
  ratingStars: { type: Number, default: 0 },
  portfolio: [],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  createdDate: { type: Date, default: Date.now },
  favoriteCreativeOfAthleteList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  userImage: { type: String, default: null },
  resetToken: { type: String, default: null },
  isAccountVerified: { type: Boolean, default: false },
  accountVerifiedToken: { type: String, default: null },
  stripeAccountId: { type: String, },
  pinnedReview: { type: mongoose.Schema.Types.ObjectId, ref: "ratings", },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
