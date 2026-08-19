import React, { useEffect, useState } from 'react';
import API from '../api/axiosClient';
import ChandasNoteCard from '../components/ChandasNoteCard';
import { Shield, BarChart2, Plus, Users, Cpu, FileText, CheckCircle, AlertCircle, Edit } from 'lucide-react';

const AdminPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Note Modal state
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('history');
  const [author, setAuthor] = useState('TYCS Admin');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, notesRes] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/chandas/notes')
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setNotes(notesRes.data.notes);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditId(null);
    setTitle('');
    setBody('');
    setCategory('history');
    setAuthor('TYCS Admin');
    setShowModal(true);
  };

  const handleOpenEdit = (note) => {
    setEditId(note._id);
    setTitle(note.title);
    setBody(note.body);
    setCategory(note.category);
    setAuthor(note.author || 'TYCS Admin');
    setShowModal(true);
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await API.delete(`/chandas/notes/${id}`);
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await API.put(`/chandas/notes/${editId}`, { title, body, category, author });
      } else {
        await API.post('/chandas/notes', { title, body, category, author });
      }
      setShowModal(false);
      fetchAdminData();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Save failed');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-4 h-4" /> Administration Control Panel
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
          System Analytics & Article Management
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Manage historical Chandaḥśāstra content and monitor algorithm engine usage metrics.
        </p>
      </div>

      {/* Analytics Metric Cards */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Cpu className="w-4 h-4 text-amber-400" /> Total Computations
            </div>
            <div className="text-2xl font-mono font-bold text-amber-300">
              {analytics.totalComputations}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-cyan-400" /> Registered Users
            </div>
            <div className="text-2xl font-mono font-bold text-cyan-300">
              {analytics.totalUsers}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <FileText className="w-4 h-4 text-purple-400" /> Published Articles
            </div>
            <div className="text-2xl font-mono font-bold text-purple-300">
              {notes.length}
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <BarChart2 className="w-4 h-4 text-emerald-400" /> Naive/Memo/Tab ratio
            </div>
            <div className="text-xs font-mono font-bold text-emerald-300">
              {analytics.modeBreakdown?.naive || 0} / {analytics.modeBreakdown?.memo || 0} / {analytics.modeBreakdown?.tabulation || 0}
            </div>
          </div>
        </div>
      )}

      {/* Article Management Section */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" /> Historical Articles Base
          </h2>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Create New Article
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notes.map((note) => (
            <ChandasNoteCard
              key={note._id}
              note={note}
              isAdmin={true}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-serif font-bold text-slate-100">
              {editId ? 'Edit Historical Article' : 'Create New Historical Article'}
            </h3>

            {msg && <div className="p-2 bg-rose-500/10 text-rose-300 text-xs rounded-lg">{msg}</div>}

            <form onSubmit={handleSubmitNote} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                  >
                    <option value="history">History</option>
                    <option value="method">Method / Math</option>
                    <option value="glossary">Glossary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Article Content (Markdown supported)</label>
                <textarea
                  rows="6"
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl"
                >
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
