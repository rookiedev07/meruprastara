import React from 'react';
import { useMeru } from '../context/MeruContext';
import { Cpu, Zap, Table, Play, BarChart2, AlertCircle } from 'lucide-react';

const EngineSelector = ({ onComputeSuccess }) => {
  const {
    n,
    setN,
    r,
    setR,
    mode,
    setMode,
    generateTriangle,
    runComputation,
    runBenchmark,
    loadingTriangle,
    loadingCompute,
    loadingBenchmark,
    errorMsg
  } = useMeru();

  const handleNChange = (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    const clampedN = Math.max(0, Math.min(val, 60));
    setN(clampedN);
    if (r > clampedN) setR(Math.floor(clampedN / 2));
  };

  const handleRChange = (e) => {
    const val = parseInt(e.target.value, 10) || 0;
    const clampedR = Math.max(0, Math.min(val, n));
    setR(clampedR);
  };

  const handleGenerateMeru = () => {
    generateTriangle(n);
  };

  const handleCompute = async () => {
    try {
      const res = await runComputation(n, r, mode);
      if (onComputeSuccess) onComputeSuccess(res);
    } catch (err) {
      // Handled in context
    }
  };

  const handleBenchmark = async () => {
    try {
      await runBenchmark(n, r);
    } catch (err) {
      // Handled in context
    }
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            Meru Engine Controls
          </h3>
          <p className="text-xs text-slate-400">Configure parameters n (total syllables/rows) & r (heavy syllables)</p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Input controls for N and R */}
      <div className="grid grid-[#1e293b] sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Row Depth (n): <span className="text-amber-400 font-bold text-sm">{n}</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max={mode === 'naive' ? 25 : 40}
              value={n}
              onChange={handleNChange}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max="50"
              value={n}
              onChange={handleNChange}
              className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-center text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Combinatorial Subset (r): <span className="text-amber-400 font-bold text-sm">{r}</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max={n}
              value={r}
              onChange={handleRChange}
              className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
            />
            <input
              type="number"
              min="0"
              max={n}
              value={r}
              onChange={handleRChange}
              className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded-lg text-center text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Mode selection buttons */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Select Computation Engine Mode:
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setMode('naive')}
            className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
              mode === 'naive'
                ? 'bg-rose-500/15 border-rose-500/50 text-rose-300 shadow-md'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-4 h-4 mb-1 text-rose-400" />
            <span className="text-xs font-semibold">1. Naive Recursive</span>
            <span className="text-[10px] opacity-70">O(2ⁿ) Exponential</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('memo')}
            className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
              mode === 'memo'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-md'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4 mb-1 text-amber-400" />
            <span className="text-xs font-semibold">2. Top-Down Memo</span>
            <span className="text-[10px] opacity-70">O(n·r) Cache Tree</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('tabulation')}
            className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
              mode === 'tabulation'
                ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-md'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Table className="w-4 h-4 mb-1 text-cyan-400" />
            <span className="text-xs font-semibold">3. Bottom-Up Tabulation</span>
            <span className="text-[10px] opacity-70">O(n·r) DP Table</span>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleGenerateMeru}
          disabled={loadingTriangle}
          className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Play className="w-3.5 h-3.5 text-amber-400" />
          {loadingTriangle ? 'Building Rows...' : `Render Meru (Rows 0..${n})`}
        </button>

        <button
          onClick={handleCompute}
          disabled={loadingCompute}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20"
        >
          <Zap className="w-3.5 h-3.5" />
          {loadingCompute ? 'Computing C(n,r)...' : `Compute C(${n}, ${r})`}
        </button>

        <button
          onClick={handleBenchmark}
          disabled={loadingBenchmark}
          className="px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          {loadingBenchmark ? 'Benchmarking...' : 'Side-by-Side Benchmark'}
        </button>
      </div>
    </div>
  );
};

export default EngineSelector;
