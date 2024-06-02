import { asyncHandler } from "../utils/asyncHandler.js";
import Like from '../models/like.models.js';
import Book from '../models/books.models.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

// Toggle like status for a book
const toggleLike = asyncHandler(async (req, res) => {
    const { bookId } = req.body;

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, 'Book not found');
    }

    // Check if the user has already liked the book
    const existingLike = await Like.findOne({ book: bookId, likedBy: req.user._id });

    if (existingLike) {
        // Remove the like
        await Like.findOneAndDelete({ book: bookId, likedBy: req.user._id });
        // Decrement the like count
        book.likeCount -= 1;
    } else {
        // Add the like
        const like = new Like({ book: bookId, likedBy: req.user._id });
        await like.save();
        // Increment the like count
        book.likeCount += 1;
    }

    await book.save();

    res.status(200).json(new ApiResponse(200, { liked: !existingLike, likeCount: book.likeCount }, 'Like status toggled successfully'));
});

const getLike = asyncHandler(async (req, res) => {
    const { bookId } = req.body;

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, 'Book not found');
    }

    // Check if the user has already liked the book
    const existingLike = await Like.findOne({ book: bookId, likedBy: req.user._id });



    res.status(200).json(new ApiResponse(200, {liked: existingLike, likeCount: book.likeCount }, 'Like status toggled successfully'));
});



export {
    toggleLike,
    getLike
};
