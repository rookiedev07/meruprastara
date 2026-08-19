import React from 'react';
import { useMeru } from '../context/MeruContext';
import EngineSelector from '../components/EngineSelector';
import RecursionTreeVisualizer from '../components/RecursionTreeVisualizer';
import { GitFork, HelpCircle } from 'lucide-react';

const RecursionTreePage = () => {
  const { computationResult, n, r, mode } = useMeru();

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <GitFork className="w-4 h-4" /> Visualizing Overlapping Subproblems
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100">
          Recursion Call Tree Explorer
        </h1>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          Compare how naive unoptimized recursion generates duplicate subproblem branches, versus how top-down memoization checks the cache <span className="font-mono text-purple-400 font-bold">memo[n][r]</span> before spawning redundant child calls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <EngineSelector />
        </div>

        <div className="lg:col-span-8">
          <RecursionTreeVisualizer
            treeData={computationResult?.tree}
            mode={computationResult?.mode || mode}
            n={computationResult?.n || n}
            r={computationResult?.r || r}
            callCount={computationResult?.callCount || 0}
            cacheHits={computationResult?.cacheHits || 0}
          />
        </div>
      </div>

      {/* Explanatory pedagogy card */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
        <div className="space-y-2">
          <h4 className="font-bold text-amber-300 flex items-center gap-2 text-sm">
            <HelpCircle className="w-4 h-4" /> Why does Naive Recursion explode?
          </h4>
          <p className="leading-relaxed">
            In naive recursive mode, <span className="font-mono text-rose-300">C(n,r)</span> spawns two recursive child calls: <span className="font-mono text-slate-200">C(n-1, r-1)</span> and <span className="font-mono text-slate-200">C(n-1, r)</span>. Without remembering previous answers, subproblems like <span className="font-mono text-amber-300">C(3,2)</span> are calculated independently dozens or millions of times. Total call count follows <span className="font-mono text-rose-400">2·C(n,r) - 1</span>, growing exponentially with <span className="font-mono">O(2ⁿ)</span> time complexity.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-purple-300 flex items-center gap-2 text-sm">
            <HelpCircle className="w-4 h-4" /> How does Memoization solve this?
          </h4>
          <p className="leading-relaxed">
            Top-down memoization stores the computed result of each <span className="font-mono text-purple-300">C(n,r)</span> in a lookup cache table <span className="font-mono text-slate-200">memo[n][r]</span> upon first evaluation. Subsequent invocations detect the existing cache entry (marked in 🟣 purple above), immediately returning in <span className="font-mono text-emerald-400 font-bold">O(1) time</span> and trimming entire exponential branches from the call tree. Total work drops to <span className="font-mono text-purple-300">O(n·r)</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecursionTreePage;
