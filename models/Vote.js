import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  poll_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Polls',
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null, // Null for non-logged-in users
  },
  option_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PollOptions',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure a user can vote only once per poll
voteSchema.index({ poll_id: 1, user_id: 1 }, { unique: true });

export const Vote = mongoose.model('Vote', voteSchema);