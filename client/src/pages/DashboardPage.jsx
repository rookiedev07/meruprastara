import React, { useEffect, useState } from 'react';
import { useMeru } from '../context/MeruContext';
import API from '../api/axiosClient';
import { User, Bookmark, Pyramid, Plus, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { n, generateTriangle } = useMeru();
  const navigate = useNavigate();

  const [savedTriangles, setSavedTriangles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    fetchSavedTriangles();
  }, []);

  const fetchSavedTriangles = async () => {
    try {
      const res = await API.get('/admin/saved-triangles');
      setSavedTriangles(res.data.savedTriangles || []);
    } catch (err) {
      console.error('Failed to load saved triangles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrent = async (e) => {
    e.preventDefault();
    try {
      await API.post('/admin/saved-triangles', {
        n,
        label: label || `Meru-Prastāra n=${n}`
      });
      setLabel('');
      setSaveSuccess('Triangle preset saved successfully!');
      fetchSavedTriangles();
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadPreset = (savedN) => {
    generateTriangle(savedN);
    navigate('/');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <User className="w-4 h-4" /> Scholar Dashboard
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
          Saved Meru Triangles & History
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Manage your saved Meru-Prastāra configurations and benchmark presets.
        </p>
      </div>

      {/* Save current active triangle widget */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400" />
          Save Active Triangle Preset
        </h3>

        {saveSuccess && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> {saveSuccess}
          </div>
        )}

        <form onSubmit={handleSaveCurrent} className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-amber-300 font-mono font-bold">
            n = {n}
          </div>
          <input
            type="text"
            placeholder="Label preset (e.g. Standard 6-Row Hexagon Meter)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="flex-1 min-w-[240px] px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Save Preset
          </button>
        </form>
      </div>

      {/* Saved Triangles Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-slate-100 flex items-center gap-2">
          <Pyramid className="w-5 h-5 text-cyan-400" /> Your Saved Configurations
        </h3>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading saved triangles...</div>
        ) : savedTriangles.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center text-slate-400">
            No saved triangles yet. Use the form above to save your first preset!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedTriangles.map((item) => (
              <div
                key={item._id}
                className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Depth: n = {item.n}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-slate-100 text-sm">{item.label}</h4>
                </div>

                <button
                  onClick={() => handleLoadPreset(item.n)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Pyramid className="w-3.5 h-3.5" /> Load & Render Meru
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
