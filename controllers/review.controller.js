import { asyncHandler } from "../utils/asyncHandler.js";
import Review from '../models/review.models.js';
import Book from '../models/books.models.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

// Add a review for a book
const addReview = asyncHandler(async (req, res) => {
    const { bookId, reviewText } = req.body;

    // Validate input data
    if (!bookId || !reviewText) {
        return res.status(400).json({ message: "Review text  required." });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, 'Book not found');
    }

    // Create the review
    const review = new Review({ bookId, userId: req.user._id, reviewText });
    await review.save();

    res.status(201).json(new ApiResponse(201, review, 'Review added successfully'));
});

// Get all reviews for a book
const getReviewsByBook = asyncHandler(async (req, res) => {
    const { bookId } = req.body;

    // console.log(bookId);

    // Validate input data
    if (!bookId) {
        return res.status(400).json({ message: "BookId required." });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, 'Book not found');
    }

    // Find all reviews for the book
    const reviews = await Review.find({ bookId }).populate('userId', 'userName');


    // const reviews = await Review.find({ bookId }).populate({
    //     path: 'userId',
    //     select: 'userName fullName', // Select the fields you want to populate
    // });


    res.status(200).json(new ApiResponse(200, reviews, 'Reviews retrieved successfully'));
});



export {
    addReview,
    getReviewsByBook

};
