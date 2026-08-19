import React from 'react';
import { BookOpen, Calendar, User, Tag, Edit, Trash2 } from 'lucide-react';

const ChandasNoteCard = ({ note, isAdmin, onEdit, onDelete }) => {
  const categoryColors = {
    history: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    method: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    glossary: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
  };

  return (
    <article className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 py-0.5 text-[10px] uppercase font-semibold border rounded-full ${categoryColors[note.category] || categoryColors.history}`}>
            {note.category}
          </span>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(note.publishedAt || Date.now()).toLocaleDateString()}</span>
          </div>
        </div>

        <h3 className="text-lg font-serif font-bold text-slate-100 leading-snug">
          {note.title}
        </h3>

        <div className="text-xs text-slate-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
          {note.body}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span>{note.author || 'Ācārya Piṅgala Research Group'}</span>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit && onEdit(note)}
              className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors"
              title="Edit Article"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete && onDelete(note._id)}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Delete Article"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default ChandasNoteCard;
