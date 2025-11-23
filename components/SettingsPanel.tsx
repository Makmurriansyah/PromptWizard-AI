import React from 'react';
import { PromptSettings, PromptMode, PromptTone, ImageModel } from '../types';
import { MODE_OPTIONS, TONE_OPTIONS, IMAGE_MODEL_OPTIONS } from '../constants';
import { Settings2, Layers, Ban, Palette } from 'lucide-react';

interface SettingsPanelProps {
  settings: PromptSettings;
  onUpdate: (newSettings: PromptSettings) => void;
  disabled: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdate, disabled }) => {
  
  const handleModeChange = (mode: PromptMode) => {
    // Reset image model if moving away from image gen, or set default if moving to it
    const newImageModel = mode === PromptMode.IMAGE_GENERATION 
        ? (settings.imageModel || ImageModel.MIDJOURNEY) 
        : undefined;
        
    onUpdate({ ...settings, mode, imageModel: newImageModel });
  };

  const handleImageModelChange = (imageModel: ImageModel) => {
    onUpdate({ ...settings, imageModel });
  };

  const handleToneChange = (tone: PromptTone) => {
    onUpdate({ ...settings, tone });
  };

  const handleComplexityChange = (complexity: 'Basic' | 'Intermediate' | 'Advanced') => {
    onUpdate({ ...settings, complexity });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...settings, quantity: parseInt(e.target.value, 10) });
  };

  const toggleNegatives = () => {
    onUpdate({ ...settings, includeNegatives: !settings.includeNegatives });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-5 space-y-6 shadow-xl">
      <div className="flex items-center space-x-2 text-slate-200 mb-4">
        <Settings2 className="w-5 h-5 text-brand-400" />
        <h2 className="font-semibold text-lg">Configuration</h2>
      </div>

      {/* Mode Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Target Application</label>
        <div className="grid grid-cols-1 gap-2">
          {MODE_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = settings.mode === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleModeChange(option.value)}
                disabled={disabled}
                className={`
                  flex items-center p-3 rounded-lg border transition-all duration-200 text-left group
                  ${isSelected 
                    ? 'bg-brand-900/40 border-brand-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]' 
                    : 'bg-slate-900/40 border-transparent hover:border-slate-600 hover:bg-slate-800/60'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className={`p-2 rounded-md mr-3 ${isSelected ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`font-medium ${isSelected ? 'text-brand-100' : 'text-slate-300'}`}>
                    {option.label}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {option.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Image Model Selection (Only visible if Mode is Image Generation) */}
      {settings.mode === PromptMode.IMAGE_GENERATION && (
        <div className="space-y-3 animate-fade-in">
           <label className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
             <Palette className="w-4 h-4" /> Target Platform
           </label>
           <div className="grid grid-cols-2 gap-2">
             {IMAGE_MODEL_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleImageModelChange(option.value)}
                  disabled={disabled}
                  className={`
                    px-3 py-2 text-xs font-medium rounded-lg border transition-all
                    ${settings.imageModel === option.value
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                      : 'bg-slate-900/40 text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {option.label}
                </button>
             ))}
           </div>
        </div>
      )}

      {/* Negative Prompt Toggle (Only for Image Gen) */}
      {settings.mode === PromptMode.IMAGE_GENERATION && (
        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50 bg-slate-900/40">
           <div className="flex items-center gap-2">
             <Ban className="w-4 h-4 text-red-400" />
             <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-300">Negative Prompts</span>
                <span className="text-[10px] text-slate-500">Auto-generate exclusions</span>
             </div>
           </div>
           
           <button 
             onClick={toggleNegatives}
             disabled={disabled}
             className={`
               w-11 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-slate-900 focus:ring-brand-500 relative
               ${settings.includeNegatives ? 'bg-brand-500' : 'bg-slate-700'}
             `}
           >
             <span 
               className={`
                 absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transform transition-transform duration-200 ease-in-out
                 ${settings.includeNegatives ? 'translate-x-5' : 'translate-x-0'}
               `}
             />
           </button>
        </div>
      )}

      {/* Quantity Selection */}
      <div className="space-y-3">
         <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4" /> Quantity
            </label>
            <span className="text-brand-400 font-mono font-bold bg-slate-900 px-2 py-0.5 rounded text-xs border border-slate-700">
                {settings.quantity}
            </span>
         </div>
         <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/50">
            <input 
                type="range" 
                min="1" 
                max="50" 
                value={settings.quantity} 
                onChange={handleQuantityChange}
                disabled={disabled}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>1</span>
                <span>25</span>
                <span>50</span>
            </div>
         </div>
      </div>

      {/* Tone Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Tone</label>
        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleToneChange(option.value)}
              disabled={disabled}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-colors border
                ${settings.tone === option.value
                  ? 'bg-brand-500 text-white border-brand-500'
                  : 'bg-transparent text-slate-400 border-slate-700 hover:border-slate-500 hover:text-slate-200'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

       {/* Complexity Selection */}
       <div className="space-y-3">
        <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Complexity</label>
        <div className="flex bg-slate-900/50 p-1 rounded-lg border border-slate-700/50">
          {(['Basic', 'Intermediate', 'Advanced'] as const).map((level) => (
            <button
              key={level}
              onClick={() => handleComplexityChange(level)}
              disabled={disabled}
              className={`
                flex-1 py-1.5 text-sm font-medium rounded-md transition-all
                ${settings.complexity === level
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};