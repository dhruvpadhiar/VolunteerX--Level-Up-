import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: Date },
  password: { type: String, required: true },
  about: { type: String },
  profileImage: { type: String },
  contactUrls: [String],
  gender: { type: String, enum: ['male', 'female', 'other'] },
  skills: [String],
  location: { type: String },

  score: { type: Number, default: 0 }, // Total hours worked

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

  eventsOngoing: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  eventsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],

  memberOf: [{ type: mongoose.Schema.Types.ObjectId, ref: 'NGO' }],

  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }]
});

export const Volunteer = mongoose.model('Volunteer', volunteerSchema);
