import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Sparkles, BookOpen } from 'lucide-react';

const MeruTriangle = ({ rows = [], selectedN, selectedR, onCellClick }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  if (!rows || rows.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center text-slate-400">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-3 animate-pulse" />
        <p className="font-semibold text-slate-200">No Meru-Prastāra rows generated yet.</p>
        <p className="text-xs mt-1">Select row depth n and click "Render Meru" above.</p>
      </div>
    );
  }

  // Generates Laghu-Guru representation string for (n, k)
  const getLaghuGuruPattern = (n, k) => {
    if (n === 0) return '—';
    const guruCount = k;
    const laghuCount = n - k;
    return 'ऽ'.repeat(guruCount) + '|'.repeat(laghuCount);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-serif font-bold text-amber-300 flex items-center gap-2">
            <span>मेरु-प्रस्तार</span>
            <span className="text-xs font-sans text-slate-400 font-normal">
              (Mount Meru Expansion · Pascal's Triangle)
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Displaying {rows.length} rows (0 to {rows.length - 1}). Click any cell C(n,r) to set inputs.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-amber-500/20 border border-amber-500/50"></span>
            <span>Boundary 1s (Base)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-purple-500/30 border border-purple-400"></span>
            <span>Target C({selectedN}, {selectedR})</span>
          </div>
        </div>
      </div>

      {/* Triangle Pyramid Container */}
      <div className="overflow-x-auto py-4 min-h-[320px] flex flex-col items-center justify-start space-y-2 select-none">
        <AnimatePresence>
          {rows.map((row, rowIdx) => {
            const rowSum = row.reduce((acc, curr) => acc + curr, 0);
            return (
              <motion.div
                key={`row-${rowIdx}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: rowIdx * 0.04 }}
                className="flex items-center justify-center gap-2 relative group/row"
              >
                {/* Row label badge */}
                <span className="absolute -left-12 text-[10px] font-mono text-slate-500 group-hover/row:text-amber-400 transition-colors">
                  n={rowIdx}
                </span>

                {row.map((val, colIdx) => {
                  const isSelected = rowIdx === selectedN && colIdx === selectedR;
                  const isBoundary = colIdx === 0 || colIdx === rowIdx;

                  return (
                    <motion.button
                      key={`cell-${rowIdx}-${colIdx}`}
                      whileHover={{ scale: 1.15, zIndex: 20 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onCellClick && onCellClick(rowIdx, colIdx)}
                      onMouseEnter={() =>
                        setHoveredCell({
                          n: rowIdx,
                          r: colIdx,
                          val,
                          pattern: getLaghuGuruPattern(rowIdx, colIdx)
                        })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`min-w-[42px] h-[42px] px-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center transition-all duration-200 shadow-md relative ${
                        isSelected
                          ? 'bg-gradient-to-tr from-purple-600 to-indigo-500 text-white border-2 border-purple-300 ring-4 ring-purple-500/30 z-10 scale-105'
                          : isBoundary
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-400'
                          : 'bg-slate-900/80 text-slate-200 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 hover:text-cyan-300'
                      }`}
                    >
                      {val}
                    </motion.button>
                  );
                })}

                {/* Row sum indicator (2^n) */}
                <span className="absolute -right-16 text-[10px] font-mono text-slate-500 group-hover/row:text-amber-400 transition-colors">
                  Σ={rowSum} (2^{rowIdx})
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Cell Hover Detail Card */}
      {hoveredCell && (
        <div className="p-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 rounded-lg font-mono font-bold text-amber-300">
              C({hoveredCell.n}, {hoveredCell.r}) = {hoveredCell.val}
            </div>
            <div>
              <span className="text-slate-400">Sanskrit Prosody Pattern: </span>
              <span className="font-mono text-amber-400 font-bold tracking-widest">
                {hoveredCell.pattern}
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Combinations of {hoveredCell.n} syllables with {hoveredCell.r} Guru (ऽ) morae
          </div>
        </div>
      )}
    </div>
  );
};

export default MeruTriangle;
