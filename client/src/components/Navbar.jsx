import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pyramid, GitFork, BarChart3, BookOpen, User, Shield } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Meru Triangle', path: '/', icon: Pyramid },
    { name: 'Recursion Tree', path: '/tree', icon: GitFork },
    { name: 'Benchmark', path: '/benchmark', icon: BarChart3 },
    { name: 'Historical Notes', path: '/history', icon: BookOpen },
    { name: 'Dashboard', path: '/dashboard', icon: User },
    { name: 'Admin', path: '/admin', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold font-serif shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            म
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-slate-100 tracking-wide">
                MERU-PRASTĀRA
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                IKS Lab
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Memoization Demonstration System</p>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
