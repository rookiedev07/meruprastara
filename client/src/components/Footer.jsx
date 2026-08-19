import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <div>
          <p className="font-serif text-slate-300 font-semibold">
            परे पूर्णमिति परे पूर्णेन पिङ्गलशास्त्रम् ॥
          </p>
          <p className="mt-1 text-slate-400">
            Chandaḥśāstra of Ācārya Piṅgala (c. 3rd–2nd Century BCE) — Precursor to Binomial Combinatorics & Dynamic Programming.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-1">
          <span className="text-slate-400 font-medium">MERN Stack Demo Platform</span>
          <span>TYCS IKS CS Assessment Project · Roll No. 2407113</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
