import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    }
    // quantity: {
    //     type: Number,
    //     required: true,
    //     default: 1,
    // },
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [cartItemSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


export default mongoose.model('Cart', cartSchema);

