import React from 'react';
import { ModelProvider } from '../types';
import { Cpu, CheckCircle, AlertTriangle, Activity, RefreshCw } from '../lib/icons';

interface ModelRouterViewProps {
  providers: ModelProvider[];
  activeProvider: string;
  totalRequests: number;
  totalTokens: number;
}

export const ModelRouterView: React.FC<ModelRouterViewProps> = ({
  providers,
  activeProvider,
  totalRequests,
  totalTokens
}) => {
  return (
    <div className="space-y-6 pb-12 font-mono">
      <div>
        <h2 className="text-sm font-bold text-zinc-100 flex items-center space-x-2 uppercase tracking-widest">
          <Cpu className="w-5 h-5 text-[#BD00FF]" />
          <span>MODEL ROUTER & AI PROVIDER ARCHITECTURE // MULTI-TIER ROUTING</span>
        </h2>
        <p className="text-xs text-zinc-500 font-sans mt-0.5">External AI model priority routing with graceful No-Provider autonomous fallback</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0A0A0A] border border-[#222222] rounded p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">ACTIVE ROUTING PROVIDER</span>
          <div className="text-base font-bold text-[#00FF41] font-mono mt-1 uppercase">
            {activeProvider || 'GEMINI 2.5 FLASH'}
          </div>
          <p className="text-[11px] text-zinc-500 font-sans mt-1">External API adapter connected</p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#222222] rounded p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">TOTAL INVOCATIONS</span>
          <div className="text-2xl font-bold text-zinc-100 font-mono mt-1 tracking-tight">
            {totalRequests}
          </div>
          <p className="text-[11px] text-zinc-500 font-sans mt-1">Multi-agent requests routed</p>
        </div>

        <div className="bg-[#0A0A0A] border border-[#222222] rounded p-4">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">TOKEN CONSUMPTION</span>
          <div className="text-2xl font-bold text-zinc-100 font-mono mt-1 tracking-tight">
            {totalTokens.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-500 font-sans mt-1">Tracked across pipeline runs</p>
        </div>
      </div>

      {/* Provider Matrix */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded p-5 shadow-2xl">
        <h3 className="text-[10px] uppercase font-mono font-bold text-zinc-500 tracking-wider mb-4">
          CONFIGURED PROVIDER HIERARCHY
        </h3>

        <div className="space-y-3">
          {providers.map((p) => {
            const isOnline = p.status === 'ONLINE';
            return (
              <div
                key={p.id}
                className="bg-[#050505] border border-[#1A1A1A] rounded p-4 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-[#00FF41] shadow-[0_0_8px_#00FF41]' : 'bg-zinc-700'}`} />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-xs text-zinc-200 font-mono">{p.name}</h4>
                      <span className="text-[11px] font-mono text-[#BD00FF]">({p.model})</span>
                    </div>
                    <p className="text-xs text-zinc-500 font-sans">Priority Level: {p.priority}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono">
                  <div className="text-right">
                    <span className="text-zinc-500 block text-[10px]">AVG LATENCY</span>
                    <span className="text-zinc-200 font-bold">{p.avgLatencyMs || 35}ms</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-none text-[10px] font-bold ${
                    isOnline ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_8px_rgba(0,255,65,0.15)]' :
                    'bg-[#141414] text-zinc-500 border border-[#282828]'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-[#050505] rounded border border-[#1C1C1C] text-xs text-zinc-400 space-y-2 font-sans">
          <div className="font-bold text-[#FFE600] font-mono text-xs">🔴 ABSOLUTE RULE COMPLIANCE:</div>
          <p>
            • <strong className="text-zinc-200 font-mono">NO OLLAMA:</strong> The system strictly accesses models through external cloud APIs and local rule heuristics.
          </p>
          <p>
            • <strong className="text-zinc-200 font-mono">AUTONOMOUS NO-PROVIDER MODE:</strong> When API keys are unconfigured, the application runs uninterrupted via deterministic heuristics synthesis.
          </p>
        </div>
      </div>
    </div>
  );
};
