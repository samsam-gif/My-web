import React from 'react';
import { Agent, AgentStatus } from '../types';
import { AgentIcon, Play, Pause, ChevronRight, CheckCircle, AlertTriangle } from '../lib/icons';

interface AgentCardProps {
  agent: Agent;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onSelect: (id: string) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onPause,
  onResume,
  onSelect
}) => {
  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_8px_rgba(0,255,65,0.2)]">
            <span className="w-1.5 h-1.5 rounded-none bg-[#00FF41] animate-ping" />
            <span>RUNNING</span>
          </span>
        );
      case 'THINKING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#FFE600]/10 text-[#FFE600] border border-[#FFE600]/40">
            <span>THINKING</span>
          </span>
        );
      case 'NEEDS_APPROVAL':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#FF3E3E]/10 text-[#FF3E3E] border border-[#FF3E3E]/40 animate-pulse">
            <span>APPROVAL</span>
          </span>
        );
      case 'WAITING':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/40">
            <span>PAUSED</span>
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/50">
            <span>ERROR</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#141414] text-zinc-500 border border-[#282828]">
            <span>IDLE</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0A0A0A] border border-[#222222] hover:border-[#383838] rounded-lg p-4 transition shadow-lg flex flex-col justify-between relative overflow-hidden group font-sans">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center space-x-3">
            <div 
              className="w-9 h-9 rounded bg-[#141414] flex items-center justify-center"
              style={{ color: agent.accentColor, border: `1px solid ${agent.accentColor}40` }}
            >
              <AgentIcon id={agent.id} className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-zinc-100 uppercase tracking-wider font-mono">{agent.name}</h3>
              <p className="text-[11px] text-zinc-500 font-mono line-clamp-1">{agent.role}</p>
            </div>
          </div>
          {getStatusBadge(agent.status)}
        </div>

        {/* Current Task Box */}
        <div className="bg-[#050505] border border-[#1A1A1A] rounded p-3 mb-3 text-xs font-mono">
          <div className="text-[9px] uppercase tracking-widest text-zinc-600 mb-1 font-bold">
            CURRENT DISPATCH
          </div>
          <div className="font-medium text-zinc-300 line-clamp-1 text-xs font-sans">
            {agent.currentTaskTitle || 'Standing by for pipeline task assignment'}
          </div>

          {/* Progress Bar */}
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
              <span>EXECUTION</span>
              <span className="text-zinc-200 font-bold">{agent.progress}%</span>
            </div>
            <div className="w-full bg-[#1A1A1A] h-1.5 rounded-none overflow-hidden">
              <div
                className="h-full rounded-none transition-all duration-300 ease-out"
                style={{
                  width: `${agent.progress}%`,
                  backgroundColor: agent.accentColor || '#00FF41',
                  boxShadow: agent.progress > 0 ? `0 0 8px ${agent.accentColor}` : 'none'
                }}
              />
            </div>
          </div>

          {/* Last Action */}
          <div className="mt-2.5 pt-2 border-t border-[#141414] flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span className="truncate pr-2">
              <strong className="text-zinc-400">ACT:</strong> {agent.lastAction}
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C] text-xs font-mono">
        <div className="flex items-center space-x-2">
          {agent.status === 'RUNNING' || agent.status === 'THINKING' ? (
            <button
              onClick={() => onPause(agent.id)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-[#141414] hover:bg-[#202020] text-zinc-300 rounded-none border border-[#282828] hover:border-[#FF3E3E]/40 transition cursor-pointer font-bold text-[10px]"
            >
              <Pause className="w-3 h-3 text-[#FFE600]" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button
              onClick={() => onResume(agent.id)}
              className="flex items-center space-x-1 px-2.5 py-1 bg-[#141414] hover:bg-[#202020] text-zinc-300 rounded-none border border-[#282828] hover:border-[#00FF41]/40 transition cursor-pointer font-bold text-[10px]"
            >
              <Play className="w-3 h-3 text-[#00FF41]" />
              <span>RESUME</span>
            </button>
          )}

          <span className="text-[10px] text-zinc-600">
            DONE: {agent.tasksCompleted}
          </span>
        </div>

        <button
          onClick={() => onSelect(agent.id)}
          className="flex items-center space-x-1 text-zinc-400 hover:text-white px-2 py-1 transition cursor-pointer text-[11px] hover:bg-[#141414] border border-transparent hover:border-[#282828]"
        >
          <span>INSPECT</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
