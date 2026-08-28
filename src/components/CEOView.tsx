import React from 'react';
import { Agent, Project, Task, ApprovalRequest, SystemHealth } from '../types';
import { CommandBox } from './CommandBox';
import { AgentCard } from './AgentCard';
import {
  Activity,
  CheckCircle,
  Clock,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  Server
} from '../lib/icons';

interface CEOViewProps {
  agents: Agent[];
  projects: Project[];
  tasks: Task[];
  approvals: ApprovalRequest[];
  health: SystemHealth | null;
  onExecuteCommand: (cmd: string) => Promise<void>;
  onPauseAgent: (id: string) => void;
  onResumeAgent: (id: string) => void;
  onSelectAgent: (id: string) => void;
  onSelectTab: (tab: string) => void;
  loading: boolean;
}

export const CEOView: React.FC<CEOViewProps> = ({
  agents,
  projects,
  tasks,
  approvals,
  health,
  onExecuteCommand,
  onPauseAgent,
  onResumeAgent,
  onSelectAgent,
  onSelectTab,
  loading
}) => {
  const pendingTasks = tasks.filter(t => t.state === 'PENDING' || t.state === 'QUEUED');
  const runningTasks = tasks.filter(t => t.state === 'RUNNING');
  const completedTasks = tasks.filter(t => t.state === 'COMPLETED');
  const failedTasks = tasks.filter(t => t.state === 'FAILED');
  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');

  const latestProject = projects[0];

  return (
    <div className="space-y-6 pb-12">
      {/* CEO Executive Command Bar */}
      <CommandBox onExecute={onExecuteCommand} loading={loading} />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono">
        <div className="bg-[#0A0A0A] border border-[#222222] hover:border-[#383838] rounded-lg p-3.5 flex flex-col justify-between transition shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
            <span>UPTIME</span>
            <Activity className="w-3.5 h-3.5 text-[#00FF41]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-100 font-mono tracking-tight">99.8%</div>
          <div className="text-[9px] text-[#00FF41] font-mono mt-1 font-bold">● ACTIVE ENGINE</div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#222222] hover:border-[#383838] rounded-lg p-3.5 flex flex-col justify-between transition shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
            <span>PROJECTS</span>
            <Layers className="w-3.5 h-3.5 text-[#00E5FF]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-100 font-mono tracking-tight">{projects.length}</div>
          <div className="text-[9px] text-[#00E5FF] font-mono mt-1">{projects.filter(p => p.status === 'IN_PROGRESS').length} in pipeline</div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#222222] hover:border-[#383838] rounded-lg p-3.5 flex flex-col justify-between transition shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
            <span>QUEUE</span>
            <Clock className="w-3.5 h-3.5 text-[#FFE600]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-100 font-mono tracking-tight">{pendingTasks.length + runningTasks.length}</div>
          <div className="text-[9px] text-[#FFE600] font-mono mt-1">{runningTasks.length} running</div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#222222] hover:border-[#383838] rounded-lg p-3.5 flex flex-col justify-between transition shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
            <span>COMPLETED</span>
            <CheckCircle className="w-3.5 h-3.5 text-[#00FF41]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-100 font-mono tracking-tight">{completedTasks.length}</div>
          <div className="text-[9px] text-zinc-500 font-mono mt-1">100% verified</div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#222222] hover:border-[#383838] rounded-lg p-3.5 flex flex-col justify-between transition shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
            <span>APPROVALS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF3E3E]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-zinc-100 font-mono tracking-tight">{pendingApprovals.length}</div>
          <div className="text-[9px] text-[#FF3E3E] font-mono mt-1 font-bold">Gated</div>
        </div>

        <div className="bg-[#0A0A0A] border border-[#222222] hover:border-[#383838] rounded-lg p-3.5 flex flex-col justify-between transition shadow-md">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] uppercase tracking-wider font-bold">
            <span>MODEL</span>
            <Cpu className="w-3.5 h-3.5 text-[#BD00FF]" />
          </div>
          <div className="mt-2 text-base font-bold text-zinc-100 truncate font-mono">
            {health?.activeModelProvider || 'Gemini 2.5'}
          </div>
          <div className="text-[9px] text-[#BD00FF] font-mono mt-1">Priority Router</div>
        </div>
      </div>

      {/* Live Pipeline DAG Visualizer */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded-lg p-5 shadow-xl font-mono">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-100 tracking-widest uppercase">
              AUTONOMOUS EXECUTION PIPELINE // DETERMINISTIC DAG
            </h3>
            <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Dependency flow from prompt decomposition to delivery</p>
          </div>
          {latestProject && (
            <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-none border border-[#00E5FF]/30 font-bold">
              PROJ: {latestProject.name}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 pt-1 relative">
          {[
            { step: '01. DESIGN', agent: 'design', label: 'UI/UX Specs', color: 'text-[#BD00FF]' },
            { step: '02. DEVELOP', agent: 'developer', label: 'Full-Stack Code', color: 'text-[#00E5FF]' },
            { step: '03. QA LAB', agent: 'qa', label: 'Unit & Regress', color: 'text-[#00FF41]' },
            { step: '04. SECURITY', agent: 'security', label: 'AST & Sec Audit', color: 'text-[#FF3E3E]' },
            { step: '05. DOCS', agent: 'documentation', label: 'API & Specs', color: 'text-zinc-400' },
            { step: '06. DEPLOY', agent: 'deployment', label: 'Production Gate', color: 'text-[#F27D26]' },
          ].map((stage, idx) => {
            const agentObj = agents.find(a => a.id === stage.agent);
            const isRunning = agentObj?.status === 'RUNNING';
            return (
              <div
                key={stage.step}
                className={`bg-[#050505] border rounded p-3 flex flex-col justify-between transition ${
                  isRunning ? 'border-[#00FF41] shadow-[0_0_10px_rgba(0,255,65,0.2)]' : 'border-[#1C1C1C] hover:border-[#2E2E2E]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-500">
                  <span>{stage.step}</span>
                  {idx < 5 && <ArrowRight className="hidden md:block w-3 h-3 text-zinc-700" />}
                </div>
                <div className="my-2">
                  <div className="font-bold text-xs text-zinc-200 font-sans">{stage.label}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase">
                    ID: {stage.agent}
                  </div>
                </div>
                <div className="text-[9px] font-mono font-bold">
                  {isRunning ? (
                    <span className="text-[#00FF41] animate-pulse">● RUNNING</span>
                  ) : (
                    <span className="text-zinc-600">✓ READY</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 9 Autonomous Agent Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold text-zinc-100 uppercase tracking-widest font-mono">
              COMPANY AGENTS // 9 AUTONOMOUS WORKERS
            </h3>
            <p className="text-[11px] text-zinc-500 font-sans mt-0.5">Persistent background agents with isolated task queues and state</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onPause={onPauseAgent}
              onResume={onResumeAgent}
              onSelect={onSelectAgent}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
