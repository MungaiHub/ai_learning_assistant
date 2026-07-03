import express from "express";
import {
    getFlashcards,
    getAllFlashcards,
    reviewFlashcard,
    toggleStarFlashcard,
    deleteFlashcard,
} from "../controllers/flashcardControllers.js";
import { protect } from "../middleware/auth.js";
}