import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChart3, Zap, Clock, Cpu, CheckCircle } from 'lucide-react';

const BenchmarkCharts = ({ benchmarkData }) => {
  if (!benchmarkData || !benchmarkData.results) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center text-slate-400">
        <BarChart3 className="w-8 h-8 text-amber-400 mx-auto mb-3 animate-pulse" />
        <p className="font-semibold text-slate-200">No benchmark comparisons run yet.</p>
        <p className="text-xs mt-1">Click "Side-by-Side Benchmark" above to test all three engines.</p>
      </div>
    );
  }

  const { n, r, results, expectedResult } = benchmarkData;

  const chartData = results.map((res) => ({
    name: res.mode === 'naive' ? 'Naive Recursive' : res.mode === 'memo' ? 'Top-Down Memo' : 'Bottom-Up Tabulation',
    mode: res.mode,
    timeMs: res.skipped ? 0 : res.executionTimeMs,
    calls: res.skipped ? 0 : res.callCount,
    cacheHits: res.cacheHits || 0,
    skipped: res.skipped,
    skipReason: res.skipReason
  }));

  const colors = {
    naive: '#f43f5e',
    memo: '#f59e0b',
    tabulation: '#06b6d4'
  };

  // Calculate speedup factor if naive was run
  const naiveRes = results.find((r) => r.mode === 'naive' && !r.skipped);
  const memoRes = results.find((r) => r.mode === 'memo');
  const speedupRatio = naiveRes && memoRes && memoRes.executionTimeMs > 0
    ? (naiveRes.callCount / Math.max(1, memoRes.callCount)).toFixed(1)
    : null;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            Performance Benchmark Comparison
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
              C({n}, {r}) = {expectedResult}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side analysis of Naive Recursion vs. Memoization vs. Tabulation
          </p>
        </div>

        {speedupRatio && (
          <div className="px-3.5 py-2 bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Memoization eliminated <strong className="text-emerald-200">{speedupRatio}x</strong> redundant calls!</span>
          </div>
        )}
      </div>

      {/* Bar Chart 1: Total Function Calls / Iterations */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          Total Function Calls / Iterations (Logarithmic Visual Scale)
        </h4>
        <div className="h-64 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Bar dataKey="calls" name="Total Calls/Iterations" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.mode]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Benchmark Summary Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl">
        <table className="w-full text-xs text-left text-slate-300">
          <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Engine Mode</th>
              <th className="px-4 py-3">Time Complexity</th>
              <th className="px-4 py-3">Execution Time (ms)</th>
              <th className="px-4 py-3">Total Calls</th>
              <th className="px-4 py-3">Cache Hits</th>
              <th className="px-4 py-3">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-950/40">
            {chartData.map((res) => (
              <tr key={res.mode} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: colors[res.mode] }}></span>
                  {res.name}
                </td>
                <td className="px-4 py-3 font-mono text-slate-400">
                  {res.mode === 'naive' ? 'O(2ⁿ)' : res.mode === 'memo' ? 'O(n·r)' : 'O(n·r)'}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-amber-300">
                  {res.skipped ? 'Skipped (Safety Limit)' : `${res.timeMs} ms`}
                </td>
                <td className="px-4 py-3 font-mono">
                  {res.skipped ? '—' : res.calls.toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono text-purple-400 font-semibold">
                  {res.cacheHits.toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                  {res.skipped ? '—' : expectedResult}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BenchmarkCharts;
