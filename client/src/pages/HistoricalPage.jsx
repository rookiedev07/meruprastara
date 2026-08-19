import React, { useEffect, useState } from 'react';
import API from '../api/axiosClient';
import ChandasNoteCard from '../components/ChandasNoteCard';
import { BookOpen, Sparkles, Music, Layers, Search } from 'lucide-react';

const HistoricalPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meterN, setMeterN] = useState(3);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await API.get('/chandas/notes');
        setNotes(res.data.notes);
      } catch (err) {
        console.error('Failed to load notes', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Generates all 2^n Laghu-Guru combinations for meter length n
  const generateMeterPermutations = (nVal) => {
    const total = Math.pow(2, nVal);
    const result = [];
    for (let i = 0; i < total; i++) {
      let pattern = '';
      let guruCount = 0;
      for (let bit = nVal - 1; bit >= 0; bit--) {
        if ((i >> bit) & 1) {
          pattern += 'ऽ'; // Guru (heavy)
          guruCount++;
        } else {
          pattern += '|'; // Laghu (light)
        }
      }
      result.push({ index: i + 1, pattern, guruCount, laghuCount: nVal - guruCount });
    }
    return result;
  };

  const permutations = generateMeterPermutations(meterN);

  const filteredNotes = selectedCategory === 'all'
    ? notes
    : notes.filter(n => n.category === selectedCategory);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-4 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            Indian Knowledge Systems · Sanskrit Prosody
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-100">
            Chandaḥśāstra & Piṅgala's Meru-Prastāra
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Discover how Ācārya Piṅgala (c. 3rd–2nd century BCE) formulated binary combinatorics, meter permutations, and the Mount Meru Expansion (Pascal's Triangle precursor) to analyze Sanskrit poetic verse.
          </p>
        </div>
      </div>

      {/* Interactive Laghu-Guru Prosody Permutations Explorer */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-serif font-bold text-amber-300 flex items-center gap-2">
              <Music className="w-5 h-5 text-amber-400" />
              Interactive Laghu-Guru Syllable Permutation Explorer (Prastāra)
            </h3>
            <p className="text-xs text-slate-400">
              Generating all <span className="font-mono text-amber-400 font-bold">2^{meterN} = {permutations.length}</span> meter patterns for syllable length n={meterN}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-slate-300 font-medium">Meter Length (n):</label>
            <input
              type="number"
              min="1"
              max="5"
              value={meterN}
              onChange={(e) => setMeterN(Math.max(1, Math.min(5, parseInt(e.target.value, 10) || 1)))}
              className="w-16 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-center font-mono text-xs text-amber-300"
            />
          </div>
        </div>

        {/* Permutation Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {permutations.map((p) => (
            <div
              key={p.index}
              className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-center space-y-1 hover:border-amber-500/40 transition-colors"
            >
              <div className="text-[10px] text-slate-500 font-mono">#{p.index}</div>
              <div className="font-mono text-base font-bold text-amber-300 tracking-widest">
                {p.pattern}
              </div>
              <div className="text-[9px] text-slate-400">
                {p.guruCount} Guru (ऽ), {p.laghuCount} Laghu (|)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Notes Articles Grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-serif font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Historical Articles & Knowledge Base
          </h2>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Category:</span>
            {['all', 'history', 'method', 'glossary'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg capitalize text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading historical knowledge base...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <ChandasNoteCard key={note._id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalPage;
