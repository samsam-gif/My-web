import React, { useState } from 'react';
import { AuditLog } from '../types';
import { Activity, ShieldAlert, ShieldCheck, Terminal, AlertTriangle } from '../lib/icons';

interface LogsViewProps {
  logs: AuditLog[];
}

export const LogsView: React.FC<LogsViewProps> = ({ logs }) => {
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter(l => {
    if (levelFilter === 'ALL') return true;
    return l.level === levelFilter;
  });

  return (
    <div className="space-y-6 pb-12 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-100 flex items-center space-x-2 uppercase tracking-widest">
            <Activity className="w-5 h-5 text-[#00E5FF]" />
            <span>AUDIT TRAIL & TELEMETRY LOGS // IMMUTABLE EVENT STREAM</span>
          </h2>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">Real-time persistent audit logs for agent actions, approvals, and security checks</p>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-1 bg-[#0A0A0A] p-1 rounded-none border border-[#222222] text-xs font-mono">
          {['ALL', 'INFO', 'APPROVAL', 'SECURITY', 'WARNING', 'ERROR'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-2.5 py-1 rounded-none transition cursor-pointer text-[11px] ${
                levelFilter === lvl ? 'bg-[#141414] text-[#00FF41] font-bold border border-[#00FF41]/40' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#050505] border border-[#222222] rounded p-4 font-mono text-xs shadow-2xl space-y-2 max-h-[650px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="text-zinc-600 py-8 text-center">NO EVENT LOGS MATCHING FILTER.</div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="py-2 px-3 rounded-none bg-[#0A0A0A] border border-[#1A1A1A] flex items-start space-x-3 hover:bg-[#111111] transition"
            >
              <span className="text-zinc-500 shrink-0 select-none text-[11px]">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>

              <span className={`px-1.5 py-0.2 rounded-none text-[9px] font-bold shrink-0 ${
                log.level === 'APPROVAL' ? 'bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40' :
                log.level === 'SECURITY' ? 'bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/40' :
                log.level === 'ERROR' ? 'bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/50' :
                log.level === 'WARNING' ? 'bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/30' :
                'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/30'
              }`}>
                {log.level}
              </span>

              {log.agentId && (
                <span className="text-[#00FF41] uppercase font-bold shrink-0 text-[11px]">
                  @{log.agentId}
                </span>
              )}

              <span className="text-zinc-300 break-all text-xs leading-relaxed">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
