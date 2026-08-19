import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GitBranch, Play, Pause, RotateCcw, ZoomIn, ZoomOut, Layers, HelpCircle } from 'lucide-react';

const RecursionTreeVisualizer = ({ treeData, mode, n, r, callCount, cacheHits }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const [playbackDepth, setPlaybackDepth] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // Playback timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackDepth((prev) => {
          if (prev >= 12) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Render D3 SVG tree
  useEffect(() => {
    if (!treeData || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = 500;

    // Clear previous SVG contents
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', 'transparent');

    const g = svg.append('g').attr('transform', 'translate(40, 40)');

    // Zoom behavior
    const zoom = d3.zoom().on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
    svg.call(zoom);

    // Create D3 tree layout
    const treeLayout = d3.tree().size([width - 120, height - 120]);
    const root = d3.hierarchy(treeData);

    // Filter nodes based on playbackDepth slider
    root.each((d) => {
      if (d.depth > playbackDepth) {
        d._children = d.children;
        d.children = null;
      }
    });

    treeLayout(root);

    // Draw Links (edges)
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 2)
      .attr('d', d3.linkVertical().x(d => d.x).y(d => d.y));

    // Draw Nodes
    const node = g
      .selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedNode(d.data);
      });

    // Node Circle Styling
    node
      .append('circle')
      .attr('r', 18)
      .attr('fill', (d) => {
        if (d.data.isCacheHit) return '#a855f7'; // Purple for Cache Hit
        if (d.data.isBaseCase) return '#10b981'; // Green for Base Case
        if (mode === 'naive' && d.depth > 1) return '#f59e0b'; // Amber for Naive recursion
        return '#06b6d4'; // Cyan for standard call
      })
      .attr('stroke', (d) => (d.data.isCacheHit ? '#c084fc' : '#1e293b'))
      .attr('stroke-width', 2.5)
      .attr('class', 'transition-all duration-300 hover:scale-125');

    // Node Label C(n,r)
    node
      .append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('fill', '#ffffff')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('font-family', 'monospace')
      .text(d => `(${d.data.n},${d.data.r})`);

    // Node Value Badge below node
    node
      .append('text')
      .attr('dy', '2.2em')
      .attr('text-anchor', 'middle')
      .attr('fill', (d) => (d.data.isCacheHit ? '#e9d5ff' : '#94a3b8'))
      .attr('font-size', '9px')
      .attr('font-family', 'monospace')
      .text(d => (d.data.value !== null ? `= ${d.data.value}` : ''));

  }, [treeData, playbackDepth, mode]);

  if (!treeData) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center text-slate-400">
        <GitBranch className="w-8 h-8 text-amber-400 mx-auto mb-3 animate-pulse" />
        <p className="font-semibold text-slate-200">No recursion call tree generated yet.</p>
        <p className="text-xs mt-1">Run Naive or Memoized engine to visualize function calls.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl relative">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            Recursion Call Tree Visualizer
            <span className="px-2.5 py-0.5 text-[10px] uppercase font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
              Mode: {mode}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Target C({n}, {r}) · Total Recursive Calls: <span className="text-amber-300 font-bold">{callCount}</span> · Cache Hits: <span className="text-purple-400 font-bold">{cacheHits || 0}</span>
          </p>
        </div>

        {/* Color Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-300 text-[11px]">Base Case (r=0/r=n)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span className="text-slate-300 text-[11px]">Recursive Subproblem</span>
          </div>
          {mode === 'memo' && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500"></span>
              <span className="text-slate-300 text-[11px]">Memoized Cache Hit</span>
            </div>
          )}
        </div>
      </div>

      {/* Playback & Depth Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-amber-400 transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Playback' : 'Play Tree Step-by-Step'}
          </button>
          <button
            onClick={() => { setPlaybackDepth(1); setIsPlaying(false); }}
            className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg"
            title="Reset Depth"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 flex-1 max-w-md">
          <span className="text-xs text-slate-400 shrink-0 font-medium">Visible Depth: {playbackDepth}</span>
          <input
            type="range"
            min="1"
            max="12"
            value={playbackDepth}
            onChange={(e) => setPlaybackDepth(parseInt(e.target.value, 10))}
            className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div ref={containerRef} className="w-full bg-slate-950/60 rounded-xl border border-slate-800/80 overflow-hidden relative">
        <svg ref={svgRef} className="w-full"></svg>

        {/* Selected Node Sidebar Overlay */}
        {selectedNode && (
          <div className="absolute bottom-3 right-3 p-3 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl max-w-xs text-xs text-slate-200 space-y-1 animate-fadeIn">
            <div className="font-bold text-amber-400 flex items-center justify-between">
              <span>Node C({selectedNode.n}, {selectedNode.r})</span>
              <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-200">✕</button>
            </div>
            <div>Value: <span className="font-mono font-bold">{selectedNode.value}</span></div>
            <div>Depth Level: <span className="font-mono">{selectedNode.depth}</span></div>
            <div>Status: {selectedNode.isCacheHit ? '🟣 Memoized Cache Hit' : selectedNode.isBaseCase ? '🟢 Base Case' : '🔵 Recursive Subcall'}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecursionTreeVisualizer;
