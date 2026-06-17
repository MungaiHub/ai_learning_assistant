import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: 
        true, 
    },
    fileSize: {
        type: Number,
        required: true
    },
EtractedText: {
    type: String,
    default: ""
},
    chunks: [
        {
            content: {
                type: String,
                required: true,
            },
            pageNumber: {
                type: Number,
                default: 0
            },
            chunkIndex: {
                type: Number,
                required: true,
            },
        },
    ],
