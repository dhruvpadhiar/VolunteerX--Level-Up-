const attendanceRecordSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  present: {
    type: Boolean,
    default: false
  }
});
