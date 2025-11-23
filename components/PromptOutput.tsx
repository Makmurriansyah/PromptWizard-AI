import React, { useState } from 'react';
import { EnhancedResponse, PromptMode } from '../types';
import { Copy, Check, Wand2, FileText, FileJson, MinusCircle, MessageSquare, Tag, Trash2, ChevronDown, ChevronUp, Info, Bookmark } from 'lucide-react';

interface PromptOutputProps {
  results: EnhancedResponse[] | null;
  mode: PromptMode;
  onClear: () => void;
}

export const PromptOutput: React.FC<PromptOutputProps> = ({ results, mode, onClear }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedNegIndex, setCopiedNegIndex] = useState<number | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());

  const copyToClipboard = async (text: string, index: number, isMain: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      if (isMain) {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        setCopiedNegIndex(index);
        setTimeout(() => setCopiedNegIndex(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const handleSave = (result: EnhancedResponse, index: number) => {
    try {
        const savedItem = {
            ...result,
            id: Date.now().toString() + Math.random().toString(36).substring(2),
            savedAt: Date.now()
        };
        
        const existing = localStorage.getItem('savedPrompts');
        const prompts = existing ? JSON.parse(existing) : [];
        
        // Prevent exact duplicates
        const isDuplicate = prompts.some((p: any) => p.enhancedPrompt === result.enhancedPrompt);
        
        if (!isDuplicate) {
            localStorage.setItem('savedPrompts', JSON.stringify([savedItem, ...prompts]));
        }
        
        setSavedIndex(index);
        setTimeout(() => setSavedIndex(null), 2000);
    } catch (err) {
        console.error('Failed to save prompt', err);
    }
  };

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedIndices);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIndices(newExpanded);
  };

  const downloadAll = (format: 'txt' | 'json') => {
    if (!results) return;

    let content = '';
    let mimeType = '';
    let extension = '';

    if (format === 'json') {
        content = JSON.stringify(results, null, 2);
        mimeType = 'application/json';
        extension = 'json';
    } else {
        content = results.map((r, i) => 
            `[PROMPT ${i + 1}]\n${r.enhancedPrompt}\n\n[EXPLANATION]\n${r.explanation}\n${r.suggestedNegativePrompt ? `\n[NEGATIVE]\n${r.suggestedNegativePrompt}\n` : ''}\n${'-'.repeat(40)}\n`
        ).join('\n');
        mimeType = 'text/plain';
        extension = 'txt';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompt_wizard_results_${new Date().getTime()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!results || results.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 border border-slate-700/50 rounded-2xl bg-slate-900/40 backdrop-blur-sm shadow-inner">
        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/5 shadow-2xl shadow-black/50">
          <Wand2 className="w-8 h-8 text-brand-500/50" />
        </div>
        <p className="text-xl font-medium text-slate-400">Ready to Generate</p>
        <p className="text-sm text-center mt-3 text-slate-600 max-w-[240px] leading-relaxed">
          Configure your settings and hit Enhance to see magic happen.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
        
        {/* Fixed Header */}
        <div className="flex-none p-4 border-b border-slate-700/50 bg-slate-900/80 flex justify-between items-center backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
                <span className="flex items-center justify-center h-6 px-2.5 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20">
                    {results.length} Results
                </span>
            </div>
            
            <div className="flex items-center space-x-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
                <span className="text-[10px] text-slate-500 font-medium px-2 uppercase tracking-wider hidden sm:block">Actions</span>
                <div className="w-px h-3 bg-slate-700 mx-1 hidden sm:block"></div>
                <button 
                    onClick={() => downloadAll('txt')}
                    className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-md transition-all"
                    title="Download as TXT"
                >
                    <FileText className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => downloadAll('json')}
                    className="p-1.5 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-md transition-all"
                    title="Download as JSON"
                >
                    <FileJson className="w-4 h-4" />
                </button>
                <div className="w-px h-3 bg-slate-700 mx-1 hidden sm:block"></div>
                <button 
                    onClick={onClear}
                    className="p-1.5 hover:bg-red-900/30 text-slate-400 hover:text-red-400 rounded-md transition-all"
                    title="Clear All"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar scroll-smooth bg-gradient-to-b from-transparent to-slate-900/30">
            {results.map((result, index) => {
                const isExpanded = expandedIndices.has(index);
                return (
                    <div key={index} className="group bg-slate-900/40 hover:bg-slate-800/60 border border-slate-700/50 hover:border-brand-500/30 rounded-xl transition-all duration-300 flex flex-col relative overflow-hidden shadow-lg hover:shadow-xl hover:shadow-black/20">
                        
                        {/* Compact Index Badge */}
                        <div className="absolute top-0 left-0 bg-slate-800/80 text-slate-500 text-[9px] font-mono px-2 py-0.5 rounded-br-lg border-b border-r border-slate-700/50 z-10 select-none">
                            #{index + 1}
                        </div>

                        {/* Main Content */}
                        <div className="p-5 pt-8 pb-4">
                            {/* Prompt Text */}
                            <div className="relative">
                                <p className="text-slate-200 text-sm leading-7 font-normal whitespace-pre-wrap font-sans selection:bg-brand-500/30">
                                    {result.enhancedPrompt}
                                </p>
                                
                                {/* Floating Actions (Save & Copy) */}
                                <div className="absolute -top-3 right-0 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleSave(result, index); }}
                                        className="p-1.5 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-white hover:border-brand-500/50 hover:bg-brand-500/20 transition-all backdrop-blur-sm"
                                        title="Save to Saved Prompts"
                                    >
                                        {savedIndex === index ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Bookmark className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); copyToClipboard(result.enhancedPrompt, index, true); }}
                                        className="p-1.5 rounded-md bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-white hover:border-brand-500/50 hover:bg-brand-500/20 transition-all backdrop-blur-sm"
                                        title="Copy Prompt"
                                    >
                                        {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Expandable Toggle Header */}
                        <button 
                            onClick={() => toggleExpand(index)}
                            className={`
                                w-full flex items-center justify-between px-5 py-3 border-t transition-colors duration-200
                                ${isExpanded ? 'bg-slate-900/60 border-slate-700/50' : 'bg-slate-950/20 border-slate-800/50 hover:bg-slate-900/40'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <Info className="w-3.5 h-3.5" />
                                    <span>Details & Analysis</span>
                                </div>
                                
                                {/* Small indicators when collapsed */}
                                {!isExpanded && (
                                    <div className="flex items-center gap-2 opacity-50">
                                        <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                        <div className="flex gap-1">
                                            {result.tags.slice(0, 2).map((tag, i) => (
                                                <span key={i} className="text-[10px] text-slate-500 px-1 border border-slate-700 rounded bg-slate-800/50">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-500" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-slate-500" />
                            )}
                        </button>

                        {/* Collapsible Content */}
                        {isExpanded && (
                            <div className="px-5 py-5 bg-slate-950/30 space-y-5 animate-fade-in border-t border-slate-800/30">
                                
                                {/* Explanation */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <MessageSquare className="w-3 h-3" /> 
                                        <span>AI Explanation</span>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed pl-5 border-l-2 border-slate-800">
                                        {result.explanation}
                                    </p>
                                </div>

                                {/* Tags */}
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                        <Tag className="w-3 h-3" /> 
                                        <span>Keywords</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 pl-5">
                                        {result.tags.map((tag, i) => (
                                            <span key={i} className="text-[11px] text-slate-300 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/50 hover:border-brand-500/30 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Negative Prompt (Conditional) */}
                                {mode === PromptMode.IMAGE_GENERATION && result.suggestedNegativePrompt && (
                                    <div className="space-y-2 pt-2 border-t border-slate-800/50 mt-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs font-bold text-red-400/80 uppercase tracking-wider">
                                                <MinusCircle className="w-3 h-3" /> 
                                                <span>Negative Prompt</span>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(result.suggestedNegativePrompt!, index, false)}
                                                className="text-[10px] text-slate-500 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-800"
                                            >
                                                {copiedNegIndex === index ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                Copy Negative
                                            </button>
                                        </div>
                                        <div className="bg-red-950/10 border border-red-500/10 rounded-lg p-3 group/neg">
                                            <p className="text-xs text-red-200/60 font-mono leading-relaxed group-hover/neg:text-red-200/80 transition-colors">
                                                {result.suggestedNegativePrompt}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
            
            <div className="h-4"></div>
        </div>
    </div>
  );
};