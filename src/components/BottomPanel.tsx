import React, { useState } from 'react';
import { Table, Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface BottomPanelProps {
  data: any[] | null;
  isOpen: boolean;
  onToggle: () => void;
}

export const BottomPanel = ({ data, isOpen, onToggle }: BottomPanelProps) => {
  const [activeTab, setActiveTab] = useState<'data' | 'events'>('data');

  if (!isOpen) {
    return (
      <div className="h-10 bg-slate-900 border-t border-white/10 flex items-center justify-between px-4 cursor-pointer hover:bg-slate-800 transition-colors shrink-0 z-20" onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <Table className="w-4 h-4" />
            Data Preview & Timeline
          </div>
        </div>
        <ChevronUp className="w-4 h-4 text-slate-500" />
      </div>
    );
  }

  return (
    <div className="h-64 bg-slate-900 border-t border-white/10 flex flex-col shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
      <div className="flex items-center justify-between border-b border-white/10 px-2 bg-slate-950/50">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('data')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'data' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <Table className="w-4 h-4" />
            Data Preview
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'events' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <Clock className="w-4 h-4" />
            Event Timeline
          </button>
        </div>
        <button onClick={onToggle} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'data' ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            {data ? 'Data table preview goes here' : 'No data loaded. Upload a dataset to preview.'}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="text-sm text-slate-300">Q3 Marketing Campaign Launched</div>
              <div className="text-xs text-slate-500 ml-auto">Oct 1, 2023</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <div className="text-sm text-slate-300">New Product Line Released</div>
              <div className="text-xs text-slate-500 ml-auto">Nov 15, 2023</div>
            </div>
            <button className="text-xs font-medium text-blue-400 hover:text-blue-300">+ Add Event</button>
          </div>
        )}
      </div>
    </div>
  );
};
