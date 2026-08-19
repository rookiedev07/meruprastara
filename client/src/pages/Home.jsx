import React from 'react';
import { useMeru } from '../context/MeruContext';
import EngineSelector from '../components/EngineSelector';
import MeruTriangle from '../components/MeruTriangle';
import RecursionTreeVisualizer from '../components/RecursionTreeVisualizer';
import BenchmarkCharts from '../components/BenchmarkCharts';
import { Sparkles, BookOpen, Cpu, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const {
    n,
    setN,
    r,
    setR,
    triangleRows,
    computationResult,
    benchmarkResult,
    generateTriangle,
    runComputation
  } = useMeru();
  const navigate = useNavigate();

  const handleCellClick = (rowIdx, colIdx) => {
    setN(rowIdx);
    setR(colIdx);
    runComputation(rowIdx, colIdx, 'memo');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Indian Knowledge Systems (IKS) & DSA Pedagogy
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-100 tracking-tight leading-tight">
            Ācārya Piṅgala's <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Meru-Prastāra</span> & Memoization
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Reconstruct the ancient Indian precursor to Pascal's Triangle composed in the <em>Chandaḥśāstra</em> (c. 3rd century BCE). Compare naive recursion, top-down memoization, and bottom-up tabulation algorithms in real-time.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 pt-2">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Binomial C(n,r)</span>
            <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-amber-400" /> Node.js Worker Isolation</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-cyan-400" /> Sanskrit Meter Combinatorics</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Controls + Triangle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <EngineSelector />
        </div>

        <div className="lg:col-span-7">
          <MeruTriangle
            rows={triangleRows}
            selectedN={n}
            selectedR={r}
            onCellClick={handleCellClick}
          />
        </div>
      </div>

      {/* Computation Result Callout */}
      {computationResult && (
        <section className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-semibold text-amber-400">Active Computation Output</span>
              <h3 className="text-xl font-mono font-bold text-slate-100">
                C({computationResult.n}, {computationResult.r}) = <span className="text-amber-400">{computationResult.result}</span>
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
              <span className="px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800">Mode: <strong className="text-cyan-300 capitalize">{computationResult.mode}</strong></span>
              <span className="px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800">Time: <strong className="text-amber-300">{computationResult.executionTimeMs} ms</strong></span>
              <span className="px-3 py-1.5 bg-slate-900 rounded-xl border border-slate-800">Calls: <strong className="text-rose-400">{computationResult.callCount}</strong></span>
              {computationResult.cacheHits > 0 && (
                <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30">Cache Hits: <strong>{computationResult.cacheHits}</strong></span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Embedded Visualizer */}
      {computationResult && computationResult.tree && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-slate-100">Live Call Tree Visualization</h2>
            <button
              onClick={() => navigate('/tree')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              Open Fullscreen Visualizer →
            </button>
          </div>
          <RecursionTreeVisualizer
            treeData={computationResult.tree}
            mode={computationResult.mode}
            n={computationResult.n}
            r={computationResult.r}
            callCount={computationResult.callCount}
            cacheHits={computationResult.cacheHits}
          />
        </section>
      )}

      {/* Embedded Benchmark */}
      {benchmarkResult && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-slate-100">Comparative Benchmark Analysis</h2>
            <button
              onClick={() => navigate('/benchmark')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              Explore Detailed Benchmarks →
            </button>
          </div>
          <BenchmarkCharts benchmarkData={benchmarkResult} />
        </section>
      )}
    </div>
  );
};

export default Home;
