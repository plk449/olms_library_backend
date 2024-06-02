import mongoose from "mongoose";

const likeSchema =new mongoose.Schema({
    // comment: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"Comment"
    // },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Book"
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps: true})

export default mongoose.model("Like", likeSchema);