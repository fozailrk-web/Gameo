import React, { useState } from 'react';
import { Upload, Plus, Trash2, Play, FileText, Code, List, Database, Layers, Settings, GitMerge, PanelLeftClose } from 'lucide-react';
import { PipelineConfig } from '../utils/pipeline';

interface SidebarProps {
  onFileUpload: (file: File) => void;
  onAppendFile: (file: File) => void;
  onLoadSample: () => void;
  data: any[] | null;
  code: string;
  setCode: (code: string) => void;
  events: string[];
  setEvents: (events: string[]) => void;
  instructions: string;
  setInstructions: (instructions: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  pipelineConfig: PipelineConfig;
  setPipelineConfig: React.Dispatch<React.SetStateAction<PipelineConfig>>;
  onRunPipeline: () => void;
  isPipelineRunning: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onFileUpload,
  onAppendFile,
  onLoadSample,
  data,
  code,
  setCode,
  events,
  setEvents,
  instructions,
  setInstructions,
  onGenerate,
  isGenerating,
  pipelineConfig,
  setPipelineConfig,
  onRunPipeline,
  isPipelineRunning,
  onClose
}) => {
  const [newEvent, setNewEvent] = useState('');
  const [uploadMode, setUploadMode] = useState<'new' | 'append'>('new');

  const handleAddEvent = () => {
    if (newEvent.trim()) {
      setEvents([...events, newEvent.trim()]);
      setNewEvent('');
    }
  };

  const handleRemoveEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto text-slate-700 bg-white relative">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors z-10"
          title="Minimize Sidebar"
        >
          <PanelLeftClose className="w-5 h-5" />
        </button>
      )}
      <div className="p-6 space-y-8 flex-1">
        {/* 1. Data Source */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pr-8">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              1. Data Source
            </h2>
            {data && (
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                {data.length} ROWS
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <select 
                value={uploadMode} 
                onChange={(e) => setUploadMode(e.target.value as 'new' | 'append')}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 appearance-none cursor-pointer"
              >
                <option value="new">Mode: New Dataset</option>
                <option value="append" disabled={!data}>Mode: Append & Merge</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center px-2 pointer-events-none">
                <Plus className="w-3 h-3 text-slate-400 rotate-45" />
              </div>
            </div>

            <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all group ${
              uploadMode === 'new' 
                ? 'border-blue-100 hover:bg-blue-50 bg-slate-50' 
                : 'border-emerald-100 hover:bg-emerald-50 bg-emerald-50/30'
            }`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploadMode === 'new' ? (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-blue-400 group-hover:text-blue-600 transition-colors" />
                    <p className="text-xs text-slate-500">Drop <span className="font-bold text-blue-600">New</span> CSV here</p>
                  </>
                ) : (
                  <>
                    <Layers className="w-8 h-8 mb-2 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
                    <p className="text-xs text-slate-500">Drop <span className="font-bold text-emerald-600">Append</span> CSV here</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".csv" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (uploadMode === 'new') onFileUpload(file);
                    else onAppendFile(file);
                  }
                }} 
              />
            </label>
          </div>

          <button 
            onClick={onLoadSample}
            className="w-full py-2 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors bg-white shadow-sm"
          >
            Load Sample Dataset
          </button>
        </div>

        {/* 2. Pipeline Configuration */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-500" />
            2. Pipeline Config
          </h2>
          
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={pipelineConfig.enableValidation}
                onChange={(e) => setPipelineConfig({...pipelineConfig, enableValidation: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Data Validation</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={pipelineConfig.enableCleaning}
                onChange={(e) => setPipelineConfig({...pipelineConfig, enableCleaning: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Deduplication</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={pipelineConfig.enableImputation}
                onChange={(e) => setPipelineConfig({...pipelineConfig, enableImputation: e.target.checked})}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-slate-700">Missing Value Imputation</span>
            </label>
            
            <div className="pt-3 border-t border-slate-200 mt-3">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Schema Mode</label>
              <select 
                value={pipelineConfig.schemaMode}
                onChange={(e) => setPipelineConfig({...pipelineConfig, schemaMode: e.target.value as 'flat' | 'star'})}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="flat">Flat Table</option>
                <option value="star">Star Schema</option>
              </select>
            </div>

            {pipelineConfig.schemaMode === 'star' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dimension Columns (comma separated)</label>
                <input 
                  type="text"
                  value={pipelineConfig.dimensionColumns.join(', ')}
                  onChange={(e) => setPipelineConfig({
                    ...pipelineConfig, 
                    dimensionColumns: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="e.g. category, state"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}
          </div>

          <button
            onClick={onRunPipeline}
            disabled={isPipelineRunning || !data}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isPipelineRunning ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <GitMerge className="w-4 h-4" />
            )}
            Run Pipeline
          </button>
        </div>

        {/* 3. Code Input Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-500" />
            3. Preprocessing Code
          </h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="# Paste Python preprocessing code here..."
            className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-mono text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none shadow-inner"
          />
        </div>

        {/* 4. Event Input Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <List className="w-4 h-4 text-blue-500" />
            4. Business Events
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddEvent()}
              placeholder="e.g. 15M contract with XYZ"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-inner"
            />
            <button
              onClick={handleAddEvent}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {events.map((event, index) => (
              <div key={index} className="flex items-center justify-between bg-white border border-slate-200 shadow-sm rounded-lg px-3 py-2 text-sm">
                <span className="truncate pl-2 font-medium">{event}</span>
                <button onClick={() => handleRemoveEvent(index)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Instruction Input Box */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            5. Instructions
          </h2>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Do cross-column imputation, clean null values..."
            className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none shadow-inner"
          />
        </div>
      </div>

      <div className="p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          {isGenerating ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Play className="w-5 h-5 fill-current" />
          )}
          Generate Story
        </button>
      </div>
    </div>
  );
};
