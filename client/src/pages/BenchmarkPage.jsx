import React from 'react';
import { useMeru } from '../context/MeruContext';
import EngineSelector from '../components/EngineSelector';
import BenchmarkCharts from '../components/BenchmarkCharts';
import { BarChart3, Zap, ShieldAlert, Award } from 'lucide-react';

const BenchmarkPage = () => {
  const { benchmarkResult } = useMeru();

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider">
          <BarChart3 className="w-4 h-4" /> Performance Benchmarking Suite
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
          Side-by-Side Algorithm Benchmark
        </h1>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Test Naive Recursive, Top-Down Memoized, and Bottom-Up Tabulation engines on identical inputs <span className="font-mono text-amber-300 font-bold">(n, r)</span>. Measure exact CPU execution time ($ms$), call stack count, and cache hit metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <EngineSelector />
        </div>

        <div className="lg:col-span-8">
          <BenchmarkCharts benchmarkData={benchmarkResult} />
        </div>
      </div>

      {/* Safety Notice & Algorithm Complexity Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="glass-panel p-5 rounded-2xl border border-rose-500/20 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-400">
            <ShieldAlert className="w-4 h-4" /> Naive Recursion
          </div>
          <div className="font-mono text-[11px] text-slate-400">Time: O(2ⁿ) · Space: O(n)</div>
          <p className="text-slate-300 leading-relaxed">
            Exponential growth causes computation time to explode. Capped at <span className="font-mono text-rose-300 font-bold">n ≤ 25</span> in benchmark comparison to protect server responsiveness.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Zap className="w-4 h-4" /> Top-Down Memoization
          </div>
          <div className="font-mono text-[11px] text-slate-400">Time: O(n·r) · Space: O(n·r)</div>
          <p className="text-slate-300 leading-relaxed">
            Eliminates redundant function calls by storing evaluated states in a cache table. Fast recursion with call stack tracking.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 space-y-2">
          <div className="flex items-center gap-2 font-bold text-cyan-400">
            <Award className="w-4 h-4" /> Bottom-Up Tabulation
          </div>
          <div className="font-mono text-[11px] text-slate-400">Time: O(n·r) · Space: O(n·r)</div>
          <p className="text-slate-300 leading-relaxed">
            Iteratively constructs the Meru-Prastāra DP matrix row by row. Zero recursion overhead and optimal cache locality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkPage;
