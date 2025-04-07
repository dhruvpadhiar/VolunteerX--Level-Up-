import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  present: { type: Boolean, default: false }
});

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },

  photo: { type: String },

  description: { type: String },
  location: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },

  skillsRequired: [String],
  volunteerCapacity: { type: Number },

  status: { type: String, enum: ['active', 'upcoming', 'past'], required: true },

  hostedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },

  attendanceRecord: [attendanceRecordSchema],
  volunteerRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }],


  approvedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" }],

  totalHours: { type: Number } // Can also be computed dynamically
});

export const Event = mongoose.model('Event', eventSchema);
