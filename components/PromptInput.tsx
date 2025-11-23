import React from 'react';
import { Sparkles, X, CornerDownLeft } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onEnhance: () => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, onEnhance, isLoading }) => {
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      if (value.trim() && !isLoading) onEnhance();
    }
  };

  return (
    <div className="group relative w-full">
      {/* Glow Effect behind */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-2xl opacity-20 group-focus-within:opacity-50 transition duration-500 blur-lg"></div>
      
      {/* Main Container */}
      <div className="relative flex flex-col bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl transition-all duration-300 group-focus-within:border-brand-500/50 group-focus-within:shadow-brand-500/10 group-focus-within:bg-slate-900/90">
        
        {/* Text Area */}
        <div className="relative">
            <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What do you want to create? (e.g. 'Cyberpunk street cat', 'React login form')"
            className="w-full bg-transparent text-lg text-slate-100 placeholder-slate-500 p-6 pb-16 focus:outline-none resize-none min-h-[140px] rounded-2xl"
            disabled={isLoading}
            />
            
            {/* Clear Button */}
            {value && !isLoading && (
            <button 
                onClick={() => onChange('')}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-600 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                title="Clear input"
            >
                <X className="w-4 h-4" />
            </button>
            )}
        </div>

        {/* Action Bar (Bottom of Input) */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
            
            {/* Keyboard Hint */}
            <div className="hidden sm:flex items-center space-x-2 text-[10px] text-slate-500 font-medium px-2 select-none">
                <CornerDownLeft className="w-3 h-3 opacity-50" />
                <span>Ctrl + Enter to run</span>
            </div>
            
            {/* Enhance Button */}
            <button
            onClick={onEnhance}
            disabled={!value.trim() || isLoading}
            className={`
                flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all shadow-lg ml-auto
                ${!value.trim() || isLoading
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 hover:shadow-brand-500/25 border border-transparent transform active:scale-95'}
            `}
            >
            {isLoading ? (
                <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Thinking...</span>
                </>
            ) : (
                <>
                <Sparkles className="w-4 h-4" />
                <span>Enhance</span>
                </>
            )}
            </button>
        </div>
      </div>
    </div>
  );
};