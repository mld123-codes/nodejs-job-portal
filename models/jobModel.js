const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Copany is required'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ['pending', 'rejected', 'interview'],
      default: 'pending',
    },
    workType: {
      type: String,
      enum: ['full-time', 'part-time', 'interneShip', 'contract'],
      default: 'full-time',
    },
    workLocation: {
      type: String,
      default: 'Conakry',
      required: [true, 'location is required'],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User2',
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Job', jobSchema);
