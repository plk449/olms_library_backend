import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  borrowDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Transaction', transactionSchema);
