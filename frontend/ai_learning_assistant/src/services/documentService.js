import axiosInstance, { toServiceError } from "../utilis/axiosIntance";
import { API_PATHS } from "../utilis/apiPaths";

const getDocuments = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENTS);
        return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (error) {
        throw toServiceError(error, "Failed to fetch documents.");
    }
};

const uploadDocument = async (formData) => {
    try {
        const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData);
        return response.data;
    } catch (error) {
        throw toServiceError(error, "Failed to upload document.");
    }
};

const deleteDocument = async (documentId) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(documentId));
        return response.data;
    } catch (error) {
        throw toServiceError(error, "Failed to delete document.");
    }
};

const getDocumentById = async (id) => {
    try {
        const response = await axiosInstance.get(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id));
        return response.data?.data || response.data;
    } catch (error) {
        throw toServiceError(error, "Failed to fetch document details.");
    }
};

const documentService = {
    getDocuments,
    uploadDocument,
    deleteDocument,
    getDocumentById,
};

export default documentService;
