import axiosInstance, { toServiceError } from "../utilis/axiosIntance";
import { API_PATHS } from "../utilis/apiPaths";

const getAllFlashcardSets = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_FLASHCARDS_SETS);
        return response.data;
    } catch (error) {
        throw toServiceError(error, "Failed to fetch flashcard sets.");
    }
};

const getFlashcardsForDocument = async (documentId) => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_FLASHCARDS_FOR_DOC(documentId));
        return response.data;
    } catch (error) {
        throw toServiceError(error, "Failed to fetch flashcards for the document.");
    }
};

const reviewFlashcard = async (cardId, cardIndex) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_FLASHCARD(cardId), { cardIndex });
        return response.data;
    } catch (error) {
        throw toServiceError(error, "Failed to review flashcard.");
    }
};

const toggleStar = async (cardId) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId));
        return response.data;
    } catch (error) {
        throw toServiceError(error, "Failed to toggle star for flashcard.");
    }
};

const deleteFlashcardSet = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_FLASHCARD_SET(id));
        return response.data;
    } catch (error) {
        throw toServiceError(error, "Failed to delete flashcards.");
    }
};

const flashcardService = {
    getAllFlashcardSets,
    getFlashcardsForDocument,
    reviewFlashcard,
    toggleStar,
    deleteFlashcardSet,
};

export default flashcardService;
