import React from 'react';
import { Crown, Activity, ShieldCheck, Cpu, RefreshCw } from '../lib/icons';
import { SystemHealth } from '../types';

interface HeaderProps {
  health: SystemHealth | null;
  wsConnected: boolean;
  onRefresh: () => void;
  pendingApprovalsCount: number;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  health,
  wsConnected,
  onRefresh,
  pendingApprovalsCount,
  onSelectTab
}) => {
  return (
    <header className="bg-[#0A0A0A] border-b border-[#222222] px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-2xl">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded bg-[#141414] border border-[#00FF41]/40 flex items-center justify-center shadow-[0_0_12px_rgba(0,255,65,0.15)]">
          <Crown className="w-5 h-5 text-[#00FF41]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-bold text-sm text-zinc-100 tracking-wider font-mono">AI COMPANY COMMAND CENTER</h1>
            <span className="text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded-none bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 font-bold">
              ROOT // OWNER
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono tracking-tight">Autonomous Multi-Agent Enterprise Operations & Telemetry</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-xs">
        {/* Real-time WebSocket indicator */}
        <div className="flex items-center space-x-2 bg-black px-3 py-1.5 rounded border border-[#222222]">
          <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-[#00FF41] shadow-[0_0_8px_#00FF41] animate-pulse' : 'bg-[#FF3E3E]'}`} />
          <span className="text-zinc-300 font-mono text-[11px] tracking-wide">
            {wsConnected ? 'LIVE TELEMETRY' : 'WS RECONNECTING'}
          </span>
        </div>

        {/* Pending Approvals Badge */}
        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => onSelectTab('approvals')}
            className="flex items-center space-x-1.5 bg-[#FF3E3E]/10 text-[#FF3E3E] hover:bg-[#FF3E3E]/20 px-3 py-1.5 rounded border border-[#FF3E3E]/40 font-mono text-xs font-semibold transition cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF3E3E]" />
            <span>{pendingApprovalsCount} Approval{pendingApprovalsCount > 1 ? 's' : ''} Pending</span>
          </button>
        )}

        {/* Model Provider Info */}
        <div className="hidden md:flex items-center space-x-1.5 bg-black px-3 py-1.5 rounded border border-[#222222] text-zinc-300">
          <Cpu className="w-3.5 h-3.5 text-[#00E5FF]" />
          <span className="text-zinc-500 font-mono text-[11px]">PROVIDER:</span>
          <span className="font-mono text-[#00E5FF] font-medium text-[11px]">{health?.activeModelProvider || 'Gemini 2.5'}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          className="p-1.5 bg-[#141414] hover:bg-[#222222] text-zinc-300 hover:text-white rounded border border-[#282828] transition cursor-pointer"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
