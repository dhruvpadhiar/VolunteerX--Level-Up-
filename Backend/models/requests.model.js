import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  type: { type: String, enum: ['ngo', 'event'], required: true },

  joinStatus: { type: String, enum: ['accepted', 'declined', 'pending'], default: 'pending' },

  fromVolunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },

  toNgo: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO' }, // If request type is 'ngo'
  toEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // If request type is 'event'

  createdAt: { type: Date, default: Date.now }
});

export const Request = mongoose.model('Request', requestSchema);
