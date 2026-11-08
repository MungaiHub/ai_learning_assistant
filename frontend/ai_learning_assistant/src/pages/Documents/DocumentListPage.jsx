import React, { useState, useEffect } from 'react';
import { Plus, Upload, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

import documentService from '../../services/documentService';
import Spinner from '../../componenets/common/Spinner';
import Button from '../../componenets/common/Button';
import DocumentCard from '../../componenets/documents/DocumentCard'; 

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setUploadFile(null);
    setUploadTitle('');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error('Please select a file and provide a title.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('document', uploadFile);
    formData.append('title', uploadTitle);
    try {
      await documentService.uploadDocument(formData);
      toast.success('Document uploaded successfully.');
      closeUploadModal();
      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(error.message || 'Failed to upload document. Please try again later.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedDoc(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;

    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`${selectedDoc.title} deleted.`);
      setDocuments((prev) => prev.filter((doc) => doc._id !== selectedDoc._id));
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document. Please try again later.');
    } finally {
      setDeleting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner />
        </div>
      );
    }

    if (documents.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-4">
              <FileText className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2">
              No Documents Yet
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Get started by uploading your first PDF document to begin learning.
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              Upload Document
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {documents.map((doc) => (
          <DocumentCard key={doc._id} document={doc} onDelete={handleDeleteRequest} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">My Documents</h1>
            <p className="text-slate-500 text-sm">Manage and organize your learning materials.</p>
          </div>
          {documents.length > 0 && (
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              Upload Document
            </Button>
          )}
        </div>

        {renderContent()}
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-6">
            <button
              type="button"
              aria-label="Close"
              onClick={closeUploadModal}
              className="absolute top-4 right-4 z-10 flex items-center justify-center w-11 h-11 rounded-xl border-2 border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-100"
            >
              <X className="w-6 h-6" strokeWidth={2.5} />
            </button>

            <div className="mb-6 pr-10">
              <h2 className="text-xl font-medium text-slate-900 tracking-tight">Upload New Document</h2>
              <p className="text-sm text-slate-500 mt-1">Add a PDF document to your library</p>
            </div>

            <form onSubmit={handleUpload} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Document Title
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., React Interview Prep"
                  className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                  Select PDF File
                </label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-200">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div className="flex flex-col items-center justify-center py-10 px-6">
                    <div className="w-14 h-14 rounded-xl bg-linear-to-r from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                      <Upload className="w-7 h-7 text-emerald-600" strokeWidth={2} />
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      {uploadFile ? (
                        <span className="text-emerald-600">{uploadFile.name}</span>
                      ) : (
                        <>
                          <span className="text-emerald-600">Click to upload</span> or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">PDF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={closeUploadModal} disabled={uploading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading} className="flex-1">
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Uploading...
                    </span>
                  ) : (
                    'Upload'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-6">
            <h2 className="text-xl font-medium text-slate-900 tracking-tight">Delete document</h2>
            <p className="text-sm text-slate-500 mt-2">
              Are you sure you want to delete <span className="font-medium text-slate-700">{selectedDoc.title}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 pt-6">
              <Button type="button" variant="outline" onClick={closeDeleteModal} disabled={deleting}>
                Cancel
              </Button>
              <Button type="button" variant="danger" onClick={handleConfirmDelete} disabled={deleting} className="flex-1">
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;
