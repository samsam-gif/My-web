import React, { useState } from 'react';
import { Terminal, Sparkles, ArrowRight } from '../lib/icons';

interface CommandBoxProps {
  onExecute: (command: string) => Promise<void>;
  loading: boolean;
}

export const CommandBox: React.FC<CommandBoxProps> = ({ onExecute, loading }) => {
  const [input, setInput] = useState('');

  const sampleCommands = [
    'Create a simple landing page for a mobile repair shop.',
    'Build a modern dark-mode cryptocurrency portfolio tracker with mock price charts.',
    'Design and construct a high-converting developer tools SaaS landing page.'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    await onExecute(input.trim());
    setInput('');
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#222222] hover:border-[#333333] rounded-lg p-5 shadow-2xl relative overflow-hidden font-mono transition">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#00FF41]" />
          <h2 className="text-xs font-bold text-zinc-100 uppercase tracking-widest">
            OWNER COMMAND DISPATCHER // PROMPT ORCHESTRATION
          </h2>
        </div>
        <span className="text-[10px] font-mono text-[#00FF41] bg-[#00FF41]/10 px-2 py-0.5 rounded-none border border-[#00FF41]/30 font-bold">
          DETERMINISTIC PIPELINE
        </span>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What should the AI Company build? (e.g. Create a simple landing page for a mobile repair shop.)"
            className="w-full bg-[#050505] border border-[#282828] focus:border-[#00FF41] text-zinc-100 placeholder-zinc-600 text-xs rounded-none py-3.5 pl-4 pr-36 transition outline-none font-mono shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#00FF41] hover:bg-[#00FF41]/90 disabled:opacity-30 text-black font-bold text-xs rounded-none flex items-center space-x-1.5 shadow-[0_0_12px_rgba(0,255,65,0.3)] transition cursor-pointer disabled:cursor-not-allowed font-mono uppercase tracking-wider"
          >
            {loading ? (
              <span>ORCHESTRATING...</span>
            ) : (
              <>
                <span>DISPATCH</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Quick Prompts */}
      <div className="mt-3 flex items-center flex-wrap gap-2 text-xs">
        <span className="text-zinc-500 text-[10px] uppercase tracking-wider">PRESETS:</span>
        {sampleCommands.map((cmd, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInput(cmd)}
            className="text-[11px] font-sans bg-[#141414] hover:bg-[#1A1A1A] text-zinc-400 hover:text-[#00FF41] px-2.5 py-1 rounded-none border border-[#222222] hover:border-[#00FF41]/40 transition cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
