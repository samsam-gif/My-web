import React from 'react';
import { Smartphone, Code, Server, CheckCircle, ArrowRight } from '../lib/icons';

export const AndroidApiView: React.FC = () => {
  const endpoints = [
    { method: 'POST', path: '/api/auth/login', desc: 'Authenticate Owner / CEO credentials & retrieve bearer JWT token' },
    { method: 'GET', path: '/api/projects', desc: 'Fetch all active and completed multi-agent projects' },
    { method: 'POST', path: '/api/projects', desc: 'Dispatch autonomous CEO command (e.g. {"command": "Build landing page"})' },
    { method: 'GET', path: '/api/tasks', desc: 'List tasks with DAG dependency status and retry counts' },
    { method: 'GET', path: '/api/agents', desc: 'Query real-time status of all 9 company agents' },
    { method: 'POST', path: '/api/agents/{id}/pause', desc: 'Pause an individual agent worker' },
    { method: 'POST', path: '/api/agents/{id}/resume', desc: 'Resume a paused agent worker' },
    { method: 'GET', path: '/api/approvals', desc: 'Query pending high-risk approval requests' },
    { method: 'POST', path: '/api/approvals/{id}/approve', desc: 'Authorize high-risk action (deployment, code mutation)' },
    { method: 'POST', path: '/api/approvals/{id}/reject', desc: 'Reject high-risk action' },
    { method: 'GET', path: '/api/logs', desc: 'Fetch immutable audit telemetry logs' },
    { method: 'GET', path: '/api/system/health', desc: 'System health check and worker pool status' },
    { method: 'WS', path: '/ws', desc: 'Real-time bidirectional event streaming socket' }
  ];

  return (
    <div className="space-y-6 pb-12 font-mono">
      <div>
        <h2 className="text-sm font-bold text-zinc-100 flex items-center space-x-2 uppercase tracking-widest">
          <Smartphone className="w-5 h-5 text-[#00FF41]" />
          <span>MOBILE-READY ANDROID BACKEND ARCHITECTURE // DUAL-GATEWAY</span>
        </h2>
        <p className="text-xs text-zinc-500 font-sans mt-0.5">The backend serves as the single source of truth for both React Web and native Android applications</p>
      </div>

      {/* Architecture Visual Diagram */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded p-6 shadow-2xl">
        <h3 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider mb-4">
          CLIENT-AGNOSTIC DUAL GATEWAY ARCHITECTURE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center font-mono text-xs">
          <div className="bg-[#050505] p-4 rounded border border-[#00E5FF]/40 text-center">
            <div className="font-bold text-[#00E5FF] text-xs uppercase">React Web Console</div>
            <p className="text-zinc-500 text-[11px] mt-1 font-sans">Browser Dashboard</p>
          </div>

          <div className="text-center text-zinc-500 font-bold">
            <span className="block text-[10px] text-[#FFE600]">REST API & WEBSOCKETS</span>
            <div className="my-1 text-[#00FF41]">──────▶</div>
            <span className="text-[10px] text-zinc-500">JSON PROTOCOL</span>
          </div>

          <div className="bg-[#050505] p-4 rounded border border-[#FFE600]/40 text-center">
            <div className="font-bold text-[#FFE600] text-xs uppercase">FastAPI / Node Engine</div>
            <p className="text-zinc-500 text-[11px] mt-1 font-sans">AI Company Source of Truth</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center font-mono text-xs mt-3">
          <div className="bg-[#050505] p-4 rounded border border-[#00FF41]/40 text-center">
            <div className="font-bold text-[#00FF41] text-xs uppercase">Native Android App</div>
            <p className="text-zinc-500 text-[11px] mt-1 font-sans">Kotlin / Jetpack Compose</p>
          </div>

          <div className="text-center text-zinc-500 font-bold">
            <span className="block text-[10px] text-[#00FF41]">SAME REST & WS APIS</span>
            <div className="my-1 text-[#00FF41]">──────▶</div>
            <span className="text-[10px] text-zinc-500">ZERO MOBILE WORKER LOGIC</span>
          </div>

          <div className="bg-[#050505] p-4 rounded border border-[#FFE600]/40 text-center">
            <div className="font-bold text-[#FFE600] text-xs uppercase">9 Backend Workers</div>
            <p className="text-zinc-500 text-[11px] mt-1 font-sans">SQLite & Model Router</p>
          </div>
        </div>
      </div>

      {/* API Reference Table */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded p-6 shadow-2xl space-y-4">
        <h3 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider">
          MOBILE-READY API SPECIFICATION
        </h3>

        <div className="space-y-2 font-mono text-xs">
          {endpoints.map((ep, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#050505] rounded border border-[#1A1A1A] flex flex-wrap items-center justify-between gap-3"
            >
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-0.5 rounded-none text-[9px] font-bold ${
                  ep.method === 'POST' ? 'bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40' :
                  ep.method === 'GET' ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40' :
                  'bg-[#BD00FF]/20 text-[#BD00FF] border border-[#BD00FF]/40'
                }`}>
                  {ep.method}
                </span>
                <span className="font-bold text-zinc-200">{ep.path}</span>
              </div>
              <span className="text-zinc-400 text-[11px] font-sans">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
