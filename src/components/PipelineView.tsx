import React, { useState } from 'react';
import { CheckCircle, Circle, Loader2, Database, Table, FileJson, AlertTriangle } from 'lucide-react';
import { PipelineResult } from '../utils/pipeline';

interface PipelineViewProps {
  rawData: any[] | null;
  pipelineResult: PipelineResult | null;
  pipelineStatus: Record<string, { status: string, logs: string[] }>;
  isPipelineRunning: boolean;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  rawData,
  pipelineResult,
  pipelineStatus,
  isPipelineRunning
}) => {
  const [previewMode, setPreviewMode] = useState<'raw' | 'processed'>('processed');

  const steps = [
    { id: 'input', label: 'Input & Ingestion' },
    { id: 'validation', label: 'Data Validation' },
    { id: 'cleaning', label: 'Cleaning & Deduplication' },
    { id: 'imputation', label: 'Missing Value Imputation' },
    { id: 'output', label: 'Schema Modeling & Output' }
  ];

  if (!rawData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400 flex-col gap-4 p-8">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-2">
          <Database className="w-12 h-12 text-blue-200" />
        </div>
        <p className="text-lg font-medium text-slate-500">Upload data to view the pipeline.</p>
      </div>
    );
  }

  const dataToPreview = previewMode === 'raw' ? rawData : (pipelineResult?.data || rawData);
  const previewHeaders = dataToPreview.length > 0 ? Object.keys(dataToPreview[0]).filter(k => !k.startsWith('_')) : [];
  const metaHeaders = dataToPreview.length > 0 ? Object.keys(dataToPreview[0]).filter(k => k.startsWith('_')) : [];

  return (
    <div className="flex-1 bg-slate-50 p-6 md:p-8 text-slate-900 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Data Pipeline</h1>
          <p className="text-slate-500 font-medium">Monitor data transformations and schema modeling.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Pipeline Flow */}
          <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Execution Flow</h2>
            <div className="space-y-6">
              {steps.map((step, index) => {
                const status = pipelineStatus[step.id]?.status || 'pending';
                const logs = pipelineStatus[step.id]?.logs || [];
                
                return (
                  <div key={step.id} className="relative">
                    {index !== steps.length - 1 && (
                      <div className="absolute top-6 right-3 bottom-[-24px] w-0.5 bg-slate-100" />
                    )}
                    <div className="flex gap-4">
                      <div className="relative z-10 mt-1">
                        {status === 'completed' ? (
                          <CheckCircle className="w-6 h-6 text-emerald-500 bg-white rounded-full" />
                        ) : status === 'running' ? (
                          <Loader2 className="w-6 h-6 text-blue-500 animate-spin bg-white rounded-full" />
                        ) : status === 'skipped' ? (
                          <Circle className="w-6 h-6 text-slate-300 bg-white rounded-full" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-200 bg-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-sm font-bold ${status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                          {step.label}
                          {status === 'skipped' && <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">SKIPPED</span>}
                        </h3>
                        {logs.length > 0 && (
                          <div className="mt-2 bg-slate-50 rounded-lg p-3 border border-slate-100 text-xs font-mono text-slate-600 space-y-1">
                            {logs.map((log, i) => (
                              <div key={i}>{log}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Data Preview */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quality Score Card */}
            {pipelineResult && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Data Quality Score</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-extrabold text-slate-900">{pipelineResult.qualityScore.toFixed(1)}</span>
                    <span className="text-sm text-slate-500">/ 100</span>
                  </div>
                </div>
                {pipelineResult.qualityScore < 90 && (
                  <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-2 rounded-lg text-sm font-medium border border-amber-100">
                    <AlertTriangle className="w-4 h-4" />
                    Imputations applied
                  </div>
                )}
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Table className="w-4 h-4 text-blue-500" />
                  Dataset Preview
                </h2>
                <div className="flex bg-slate-200/50 p-1 rounded-lg">
                  <button
                    onClick={() => setPreviewMode('raw')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      previewMode === 'raw' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Raw Data
                  </button>
                  <button
                    onClick={() => setPreviewMode('processed')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      previewMode === 'processed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Processed Data
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      {previewHeaders.map(h => (
                        <th key={h} className="px-4 py-3 font-semibold text-slate-600 border-b border-slate-200 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                      {metaHeaders.map(h => (
                        <th key={h} className="px-4 py-3 font-semibold text-indigo-600 border-b border-slate-200 whitespace-nowrap bg-indigo-50/50">
                          {h.replace('_', '')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dataToPreview.slice(0, 100).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        {previewHeaders.map(h => (
                          <td key={h} className="px-4 py-2 text-slate-700 whitespace-nowrap">
                            {row[h] !== null && row[h] !== undefined ? String(row[h]) : <span className="text-slate-300 italic">null</span>}
                          </td>
                        ))}
                        {metaHeaders.map(h => (
                          <td key={h} className="px-4 py-2 text-indigo-700 whitespace-nowrap bg-indigo-50/30 font-mono text-xs">
                            {String(row[h])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
                Showing top 100 rows. Total rows: {dataToPreview.length}
              </div>
            </div>

            {/* Schema Output Preview */}
            {pipelineResult?.schemaMode === 'star' && pipelineResult.factTable && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                  <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileJson className="w-4 h-4 text-purple-500" />
                    Star Schema Output
                  </h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Fact Table (Preview)</h3>
                    <div className="bg-slate-900 rounded-xl p-4 overflow-auto h-64">
                      <pre className="text-xs text-emerald-400 font-mono">
                        {JSON.stringify(pipelineResult.factTable.slice(0, 2), null, 2)}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Dimension Tables (Preview)</h3>
                    <div className="bg-slate-900 rounded-xl p-4 overflow-auto h-64">
                      <pre className="text-xs text-blue-400 font-mono">
                        {JSON.stringify(
                          Object.fromEntries(
                            Object.entries(pipelineResult.dimensionTables || {}).map(([k, v]) => [k, (v as any[]).slice(0, 2)])
                          ), 
                          null, 2
                        )}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
