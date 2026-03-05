import React, { useState } from 'react';
import { Activity, Download, Sparkles, Menu, Loader2 } from 'lucide-react';

export const TopBar = ({ onExport, onToggleSidebar, onAskAI, isAskingAI }: { onExport: () => void, onToggleSidebar: () => void, onAskAI: (query: string) => void, isAskingAI: boolean }) => {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim() && !isAskingAI) {
      onAskAI(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="h-14 bg-slate-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 shrink-0 z-20">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-lg font-bold text-white tracking-wide">AV <span className="text-slate-400 font-medium text-sm">Studio</span></h1>
      </div>

      <div className="flex-1 max-w-xl mx-8 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isAskingAI ? (
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-blue-400" />
          )}
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAskingAI}
          placeholder={isAskingAI ? "AI is thinking..." : "Ask AI to generate a chart or analyze data... (Press Enter)"} 
          className="w-full bg-slate-800/50 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500 disabled:opacity-50"
        />
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_10px_rgba(37,99,235,0.3)]"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
};
