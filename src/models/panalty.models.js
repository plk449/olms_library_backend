import mongoose from "mongoose";

const penaltySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    default: 'Overdue',
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  issuedDate: {
    type: Date,
    default: Date.now,
  },
  paidDate: {
    type: Date,
  },
});

export default mongoose.model('Penalty', penaltySchema);
