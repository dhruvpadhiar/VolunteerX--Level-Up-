import mongoose from 'mongoose';

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  registrationNo: { type: String, required: true, unique: true },
  yearOfEstablishment: { type: Number },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contactNo: { type: String },
  description: { type: String },
  profileImage: { type: String },
  contactUrls: [String],
  location: { type: String },

  verifiedStatus: { type: String, enum: ['yes', 'no'], default: 'no' },

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer' }],

  events: {
    active: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    upcoming: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    past: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  },

  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Request' }]
});

export const NGO = mongoose.model('NGO', ngoSchema);
