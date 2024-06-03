import { asyncHandler } from "../utils/asyncHandler.js";
import Cart from '../models/cart.models.js';
import Book from '../models/books.models.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/apiError.js";

const addToCart = asyncHandler(async (req, res) => {
    const { bookId } = req.body;
    console.log(bookId)

    // Validate bookId
    if (!bookId) {
        return res.status(400).json(new ApiResponse(400, null, 'Book ID is required'));
    }

    // find the book 
    const book = await Book.findById(bookId);
    if (!book) {
        throw new ApiError(404, 'Book not found');

    }


    //find the user
    let cart = await Cart.findOne({ user: req.user._id });
    //creat new user
    if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
    }

    const cartItem = cart.items.find(item => item.book.toString() === bookId);
    if (cartItem) {
        return res.status(400).json(new ApiResponse(400, null, 'Book is already in the cart'));
    } else {
        cart.items.push({ book: bookId });
    }

    await cart.save();

    res.status(200).json(new ApiResponse(200, cart, 'Book added to cart successfully'));
});


const getCart = asyncHandler(async (req, res) => {
    // console.log(req.user._id)
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.book');

    if (!cart) {
        throw new ApiError(404, 'Cart not found');
    }

    res.status(200).json(new ApiResponse(200, cart, 'Cart retrieved successfully'));
});


const removeFromCart = asyncHandler(async (req, res) => {
    const { bookId } = req.body;

    // console.log(bookId);

    // Validate bookId
    if (!bookId) {
        return res.status(400).json(new ApiResponse(400, null, 'Book ID is required'));
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, 'User not found');
    }

    const cartItemIndex = cart.items.findIndex(item => item.book.toString() === bookId);
    if (cartItemIndex === -1) {
        throw new ApiError(403, 'Book not found in cart');
    }

    cart.items.splice(cartItemIndex, 1);

    await cart.save();

    res.status(200).json(new ApiResponse(200, cart, 'Book removed from cart successfully'));
});

export {
    addToCart,
    getCart,
    removeFromCart
};
