import React, { useState, useEffect } from 'react';
import { PromptSettings, PromptMode, PromptTone, EnhancedResponse, ImageModel } from './types';
import { enhancePromptWithGemini } from './services/geminiService';
import { SettingsPanel } from './components/SettingsPanel';
import { PromptInput } from './components/PromptInput';
import { PromptOutput } from './components/PromptOutput';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Wand2, Zap, Key } from 'lucide-react';

const DEFAULT_SETTINGS: PromptSettings = {
  mode: PromptMode.IMAGE_GENERATION,
  imageModel: ImageModel.MIDJOURNEY,
  tone: PromptTone.CREATIVE,
  includeNegatives: true,
  complexity: 'Intermediate',
  quantity: 1,
};

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [settings, setSettings] = useState<PromptSettings>(DEFAULT_SETTINGS);
  const [results, setResults] = useState<EnhancedResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [apiKey, setApiKey] = useState<string>('');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('user_gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('user_gemini_api_key', key);
    setError(null);
  };

  const handleEnhance = async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await enhancePromptWithGemini(input, settings, apiKey);
      setResults(data);
    } catch (err: any) {
      let errorMessage = err.message || 'Something went wrong. Please check your API key and try again.';
      
      if (errorMessage === 'MISSING_API_KEY') {
        errorMessage = 'An API Key is required. Please enter your Google Gemini API Key.';
        setIsKeyModalOpen(true);
      } else if (errorMessage === 'INVALID_API_KEY') {
        errorMessage = 'The provided API Key appears to be invalid or expired.';
        setIsKeyModalOpen(true);
      } else if (errorMessage.includes("API key") || errorMessage.includes("403")) {
        errorMessage = 'Authentication failed. Please verify your API Key.';
        setIsKeyModalOpen(true);
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setResults(null);
  };

  return (
    <div className="h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 selection:bg-brand-500/30 font-sans overflow-hidden flex flex-col">
      
      <ApiKeyModal 
        isOpen={isKeyModalOpen} 
        onClose={() => setIsKeyModalOpen(false)} 
        onSave={handleSaveKey}
        currentKey={apiKey}
      />

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4 lg:py-6 max-w-[1800px] flex-1 flex flex-col h-full min-h-0">
        
        {/* Header */}
        <header className="flex-none mb-4 lg:mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="bg-gradient-to-br from-brand-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-brand-500/20 ring-1 ring-white/10">
               <Wand2 className="w-5 h-5 text-white" />
             </div>
             <div>
               <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
                 PromptWizard AI
               </h1>
               <p className="text-[11px] text-slate-500 font-semibold tracking-widest uppercase">
                 Professional Engineering
               </p>
             </div>
          </div>
          <div className="flex items-center space-x-3">
             <div className="hidden md:flex px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 text-[10px] text-slate-500 font-mono">
                v2.5-flash
             </div>
             <button
               onClick={() => setIsKeyModalOpen(true)}
               className={`
                 flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-xs font-medium
                 ${apiKey 
                   ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-white hover:border-brand-500/50' 
                   : 'bg-brand-500/10 border-brand-500/50 text-brand-400 animate-pulse'}
               `}
               title="Set API Key"
             >
               <Key className="w-3.5 h-3.5" />
               <span className="hidden sm:inline">{apiKey ? 'API Key Set' : 'Set API Key'}</span>
             </button>
          </div>
        </header>

        {/* Main Content - 2 Column Layout */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-0 pb-2">
          
          {/* Left Column: Settings (3 cols) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 h-full">
            <SettingsPanel 
              settings={settings} 
              onUpdate={setSettings} 
              disabled={isLoading}
            />
            
            <div className="bg-gradient-to-br from-indigo-950/30 to-slate-900/30 border border-indigo-500/10 rounded-xl p-4 mt-auto backdrop-blur-sm">
               <div className="flex items-start gap-3">
                 <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-medium text-indigo-200">Pro Tip</h4>
                   <p className="text-xs text-indigo-300/60 mt-1 leading-relaxed">
                     Generating multiple variations (25+) helps you explore different creative angles for the same concept.
                   </p>
                 </div>
               </div>
            </div>
          </div>

          {/* Mobile Settings (Hidden on Desktop) */}
          <div className="lg:hidden">
             <SettingsPanel settings={settings} onUpdate={setSettings} disabled={isLoading} />
          </div>

          {/* Right Column: Main Stage (9 cols) - Stacks Input & Output */}
          <div className="lg:col-span-9 flex flex-col h-full gap-4 lg:gap-6 min-h-0">
             
             {/* Input Section (Fixed Height / Compact) */}
             <div className="flex-none">
                <PromptInput 
                    value={input}
                    onChange={setInput}
                    onEnhance={handleEnhance}
                    isLoading={isLoading}
                />
                {error && (
                    <div className="mt-4 p-3 bg-red-950/30 border border-red-500/20 rounded-lg text-red-200 text-sm flex items-center animate-slide-up">
                    <span className="mr-2">⚠️</span> {error}
                    </div>
                )}
             </div>

             {/* Output Section (Fills remaining space) */}
             <div className="flex-1 min-h-0">
                <PromptOutput results={results} mode={settings.mode} onClear={handleClear} />
             </div>

          </div>

        </main>

      </div>
    </div>
  );
};

export default App;