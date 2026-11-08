import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

import documentService from '../../services/documentService';
import Spinner from '../../componenets/common/Spinner';
import PageHeader from '../../componenets/common/PageHeader';
import Tabs from '../../componenets/common/Tabs';
import { BASE_URL } from '../../utilis/apiPaths';
import ChatInterface from '../../componenets/chat/ChatInterface';
import AIActions from '../../componenets/ai/AIActions';

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDoc(data);
      } catch (error) {
        toast.error(error.message || 'Failed to load document. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const getPdfUrl = (documentData) => {
    if (!documentData) return null;

    const publicUrl = documentData.fileName;
    if (typeof publicUrl === 'string' && (publicUrl.startsWith('http://') || publicUrl.startsWith('https://'))) {
      return publicUrl;
    }

    const filePath = documentData.filePath || publicUrl;
    if (!filePath) return null;

    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      return filePath;
    }

    const fileName = filePath.split(/[/\\]/).pop();
    return `${BASE_URL}/uploads/documents/${fileName}`;
  };

  const renderContent = () => {
    const pdfUrl = getPdfUrl(doc);

    if (!pdfUrl) {
      return <div className="text-center p-8">PDF not available</div>;
    }

    return (
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
          <span className="text-sm font-medium text-slate-700">Document Viewer</span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in new tab
          </a>
        </div>
        <div className="bg-slate-100 p-1">
          <iframe
            src={pdfUrl}
            title="PDF Viewer"
            className="w-full h-[70vh] bg-white rounded border border-slate-200"
            style={{ colorScheme: 'light' }}
          />
        </div>
      </div>
    );
  };

  const renderChat = () => <ChatInterface />;
  const renderAIActions = () => {
    return (
      <AIActions />
    );
  }
  const renderFlashcards = () => 'Flashcards coming soon';
  const renderQuizzesTab = () => 'Quizzes coming soon';

  const tabs = [
    { id: 'content', label: 'Content', content: renderContent },
    { id: 'chat', label: 'Chat', content: renderChat },
    { id: 'ai-actions', label: 'AI Actions', content: renderAIActions },
    { id: 'flashcards', label: 'Flashcards', content: renderFlashcards },
    { id: 'quizzes', label: 'Quizzes', content: renderQuizzesTab },
  ];

  if (loading) {
    return <Spinner />;
  }

  if (!doc) {
    return <div className="text-center p-8">Document not found.</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link
          to="/documents"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Documents
        </Link>
      </div>
      <PageHeader title={doc.title} subtitle={doc.status ? `Status: ${doc.status}` : undefined} />
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default DocumentDetailPage;
