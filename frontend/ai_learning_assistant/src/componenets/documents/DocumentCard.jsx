import { useNavigate } from 'react-router-dom';
import { FileText, Trash2, BookOpen, BrainCircuit, Clock } from 'lucide-react';
import moment from 'moment';

const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null) return 'N/A';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const DocumentCard = ({ document, onDelete }) => {
  const navigate = useNavigate();
  const flashcardCount = document.flashcardCount ?? document.flashCardCount;
  const documentId = document._id || document.id;

  const handleNavigate = () => {
    navigate(`/documents/${documentId}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(document);
  };

  return (
    <div
      className="group relative bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl p-5 hover:border-slate-300/60 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1"
      onClick={handleNavigate}
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="shrink-0 w-12 h-12 bg-linear-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <button
            type="button"
            aria-label="Delete document"
            onClick={handleDelete}
            className="relative z-10 flex items-center justify-center w-11 h-11 rounded-xl border-2 border-slate-300 bg-white text-slate-700 shadow-sm hover:text-red-600 hover:border-red-300 hover:bg-red-50"
          >
            <Trash2 className="w-6 h-6" strokeWidth={2.25} />
          </button>
        </div>

        <h3 className="text-base font-semibold text-slate-900 truncate mb-2">
          {document.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
          {document.fileSize !== undefined && (
            <span className="font-medium">{formatFileSize(document.fileSize)}</span>
          )}
          <div className="flex items-center gap-3">
            {flashcardCount !== undefined && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-50 rounded-lg">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" strokeWidth={1.5} />
                <span className="text-xs font-semibold text-purple-700">{flashcardCount}</span>
              </div>
            )}
            {document.quizCount !== undefined && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-lg">
                <BrainCircuit className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.5} />
                <span className="text-xs font-semibold text-emerald-700">{document.quizCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
          <span>{moment(document.uploadDate).fromNow()}</span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default DocumentCard;
