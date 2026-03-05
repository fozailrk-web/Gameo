import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { CenterCanvas } from './components/CenterCanvas';
import { BottomPanel } from './components/BottomPanel';
import { DashboardState } from './types';
import { Database, Upload, Play } from 'lucide-react';
import { PipelineConfig } from './utils/pipeline';
import { askAIAssistant } from './services/geminiService';

const SAMPLE_DASHBOARD_DATA: DashboardState = {
  kpis: {
    totalRevenue: '$15.2M',
    profit: '$4.1M',
    unitsSold: '124.5k',
    cancelledOrders: '1.2k',
    returnedOrders: '850',
    aov: '$122.50'
  },
  insights: {
    highestRevenueDay: 'Sunday ($450k)',
    topProducts: ['Wireless Earbuds Pro', 'Smart Watch Series 5', 'Ergonomic Chair', 'Mechanical Keyboard', '4K Monitor'],
    anomalies: ['Unusual spike in returns for "Smart Watch Series 5" on May 14th.', 'Revenue drop on May 12th correlated with logistics failure.']
  },
  logistics: {
    damagedCount: 142,
    lostInTransport: 38,
    cancellationRate: '2.4%',
    returnRate: '1.8%'
  },
  story: "On May 13, a major 15 million contract with company XYZ significantly boosted overall revenue, making it the strongest week of the quarter. However, logistics failures impacted performance slightly, with 142 damaged products and 38 lost in transport leading to a minor spike in the cancellation rate to 2.4%. Despite these challenges, the 'Wireless Earbuds Pro' continued to drive strong sales, maintaining a healthy AOV of $122.50."
};

export default function App() {
  const [data, setData] = useState<any[] | null>(null);
  const [hasData, setHasData] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardState | null>(null);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  
  // Sidebar State
  const [code, setCode] = useState('');
  const [events, setEvents] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pipelineConfig, setPipelineConfig] = useState<PipelineConfig>({
    enableValidation: true,
    enableCleaning: true,
    enableImputation: true,
    schemaMode: 'flat',
    dimensionColumns: []
  });
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  const [isAskingAI, setIsAskingAI] = useState(false);

  const handleFileUpload = (file: File) => {
    // Mock file upload
    console.log("Uploading file:", file.name);
    setData([{ id: 1, name: 'Sample Row' }]); // Mock data
    setHasData(true);
  };

  const handleAppendFile = (file: File) => {
    console.log("Appending file:", file.name);
  };

  const [showStory, setShowStory] = useState(false);

  const handleLoadSampleData = () => {
    setData([{ id: 1, name: 'Sample Row' }]); // Mock data
    setHasData(true);
    setDashboardData(SAMPLE_DASHBOARD_DATA);
    setShowStory(false); // Hide story initially
    setBottomPanelOpen(true);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setDashboardData(SAMPLE_DASHBOARD_DATA);
      setShowStory(true); // Show story after generation
      setIsGenerating(false);
    }, 1500);
  };

  const handleRunPipeline = () => {
    setIsPipelineRunning(true);
    setTimeout(() => {
      setIsPipelineRunning(false);
      setBottomPanelOpen(true);
    }, 1000);
  };

  const handleExport = () => {
    const exportData = {
      pipelineConfig,
      dashboardData,
      data,
      code,
      instructions,
      events
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAskAI = async (query: string) => {
    setIsAskingAI(true);
    try {
      const contextData = {
        hasData,
        dashboardData,
        pipelineConfig,
        events,
        instructions
      };
      const response = await askAIAssistant(query, contextData);
      alert(`AI Response:\n\n${response}`);
    } catch (error) {
      console.error("Error asking AI:", error);
      alert("Failed to get AI response. Check your API key or try again.");
    } finally {
      setIsAskingAI(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <TopBar 
        onExport={handleExport} 
        onToggleSidebar={() => setLeftPanelOpen(!leftPanelOpen)} 
        onAskAI={handleAskAI}
        isAskingAI={isAskingAI}
      />
      <div className="flex flex-1 overflow-hidden">
        {leftPanelOpen && (
          <div className="w-80 shrink-0 border-r border-white/10 bg-white">
             <Sidebar 
                onFileUpload={handleFileUpload}
                onAppendFile={handleAppendFile}
                onLoadSample={handleLoadSampleData}
                data={data}
                code={code}
                setCode={setCode}
                events={events}
                setEvents={setEvents}
                instructions={instructions}
                setInstructions={setInstructions}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                pipelineConfig={pipelineConfig}
                setPipelineConfig={setPipelineConfig}
                onRunPipeline={handleRunPipeline}
                isPipelineRunning={isPipelineRunning}
                onClose={() => setLeftPanelOpen(false)}
              />
          </div>
        )}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {!hasData ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 relative">
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff10 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="z-10 text-center max-w-md w-full">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                  <Database className="w-8 h-8 text-blue-400/50" />
                </div>
                <h2 className="text-xl font-medium text-slate-400 mb-2">No Data Imported</h2>
                <p className="text-slate-500 text-sm">Use the sidebar to upload a dataset or load sample data to begin your analysis.</p>
              </div>
            </div>
          ) : (
            <>
              <CenterCanvas dashboardData={dashboardData} showStory={showStory} />
              <BottomPanel 
                data={data} 
                isOpen={bottomPanelOpen}
                onToggle={() => setBottomPanelOpen(!bottomPanelOpen)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
