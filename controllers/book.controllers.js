import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import Book from "../models/books.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Transaction from "../models/BookTransactionSchema.models.js"
import fs from 'fs'
import User from "../models/user.models.js"
import { sendBorrowEmail } from "../utils/brrowMail.js"
import {uploadOnCloudinary} from "../utils/cloud.js"




// List all books
const getAllBooks = asyncHandler(async (req, res) => {

    const books = await Book.find()
 
    

    return res
        .status(200)
        .json(new ApiResponse(200, books, "Books retrieved successfully"))
})

// Add a new book
const createBook = asyncHandler(async (req, res) => {
    // console.log("pollll");
    const { title, author, genre, isbn, publisher, publishedDate, description, totalCopies } = req.body;


    if (!title || !author || !genre || !isbn || !totalCopies) {
        throw new ApiError(400, "Title, Author, Genre, ISBN, TotalCopies all fields are required");
    }

    const coverImage = await uploadOnCloudinary(req.file.path)

    const createdbook = await Book.create({
        title,
        author,
        genre,
        isbn,
        publisher,
        publishedDate,
        description,
        totalCopies,
        totalCopiesAvailable: totalCopies,
        coverImage: coverImage?.url
    });

    return res.status(201).json(new ApiResponse(201, createdbook, "Book created successfully"));
});

// search By Genre
const getBooksByGenre = asyncHandler(async (req, res) => {
    const { genre } = req.body;
    const books = await Book.find({ genre });

    if (books.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, `No books found in genre: ${genre}`));
    }

    res.status(200).json(new ApiResponse(200, books, `Books in genre: ${genre}`));

});

// Search books by title using regex
const searchBooks = asyncHandler(async (req, res) => {
    const { title } = req.body;
    console.log("In book search controler");
    if (!title) {
        return res.status(400).json(new ApiResponse(400, null, "Query parameter is required"));
    }

    // use regex to search a book 
    const books = await Book.find({
        title: { $regex: `.*${title}.*`, $options: 'i' } // Case-insensitive search
    });

    if (books.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No books found matching the query"));
    }

    res.status(200).json(new ApiResponse(200, books, "Books found"));
});

// Borrow a book
const borrowBook = asyncHandler(async (req, res) => {
    const { bookId } = req.body;


    if (!bookId) {
        return res.status(400).json({ message: "bookId is required." });
    }



    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    // console.log(book);

    // Check if the book is available
    if (book.totalCopiesAvailable < 1) {
        throw new ApiError(404, "No copies of the book are available");
    }


    // Check if the user has already borrowed the book
    const existingTransaction = await Transaction.findOne({
        userId: req.user?._id,
        bookId: book._id,
        isReturned: false // Ensure the book hasn't been returned yet
    });

    if (existingTransaction) {
        throw new ApiError(400, "You have already borrowed this book");
    }

    // Create the transaction
    const transaction = new Transaction({
        userId: req.user?._id,
        // bookId: book._id,
        bookId,
        borrowDate: new Date(),
        isReturned: false,
    });
    await transaction.save();

    // Update the totalCopiesAvailable
    book.totalCopiesAvailable -= 1;
    await book.save();

    // console.log(req.user?.email);
    // User.findById

    let Intro = 'You have successfully borrowed a book from our library!';

    sendBorrowEmail(req.user?.email, book.title, new Date(), req.user.fullName, Intro);





    return res.status(201).json(new ApiResponse(201, transaction, "Book borrowed successfully"));
});


// display one a book
const getOneBook = asyncHandler(async (req, res) => {
    const { bookId } = req.body;


    if (!bookId) {
        return res.status(400).json({ message: "BookId is required." });
    }

    // Check if the book exists
    const book = await Book.findById(bookId);
    // const book = await Book.findById({bookId});
    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return res.status(201).json(new ApiResponse(201, book, "Book fatch successfully"));
});

// Return a book
const returnBook = asyncHandler(async (req, res) => {
    const { bookId } = req.body;

    // Find the transaction
    const transaction = await Transaction.findOne({
        userId: req.user?._id,
        bookId,
        isReturned: false
    });

    if (!transaction) {
        throw new ApiError(404, "Active transaction not found for this book and user");
    }

    // Mark the transaction as returned
    transaction.isReturned = true;
    transaction.returnDate = new Date();
    await transaction.save();

    // Update the book's totalCopiesAvailable
    const book = await Book.findById(bookId);
    if (!book) throw new ApiError(404, "Book not found");

    book.totalCopiesAvailable = Math.min(book.totalCopies, book.totalCopiesAvailable + 1);
    await book.save();


    let Intro = "You have successfully returned the borrowed book to our library!";

    sendBorrowEmail(req.user?.email, book.title, new Date(), req.user.fullName, Intro);

    return res.status(200).json(new ApiResponse(200, transaction, "Book returned successfully"));
});

// Get transaction history by user
const getTransactionHistoryByUser = asyncHandler(async (req, res) => {

    const transactions = await Transaction.find({ userId: req.user?._id }).populate('bookId', 'title author coverImage');

    if (transactions.length === 0) {
        return res.status(404).json(new ApiResponse(404, null, "No transactions found for this user"));
    }


    return res.status(200).json(new ApiResponse(200, transactions, "Transaction history retrieved successfully"));
});


export {
    getAllBooks,
    createBook,
    getBooksByGenre,
    searchBooks,
    borrowBook,
    returnBook,
    getTransactionHistoryByUser,
    getOneBook
};