// models/review.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reviewText: {
    type: String,
    required:true
  }
  // rating: {
  //   type: Number,
  //   min: 1,
  //   max: 5,
  // },
}, {
    timestamps:true
});

export default mongoose.model('Review', reviewSchema);
