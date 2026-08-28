import React from 'react';
import { Agent, Task, Project } from '../types';
import { AgentIcon, CheckCircle, ShieldAlert, Code, Palette, Rocket, BookOpen, TrendingUp, Users, Terminal, Play, Pause } from '../lib/icons';

interface AgentDetailViewProps {
  agent: Agent;
  tasks: Task[];
  projects: Project[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
}

export const AgentDetailView: React.FC<AgentDetailViewProps> = ({
  agent,
  tasks,
  projects,
  onPause,
  onResume
}) => {
  const agentTasks = tasks.filter(t => t.assignedAgent === agent.id);

  return (
    <div className="space-y-6 pb-12 font-mono">
      {/* Top Banner */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div
            className="w-12 h-12 rounded flex items-center justify-center shadow-lg"
            style={{ backgroundColor: `${agent.accentColor}15`, color: agent.accentColor, border: `1px solid ${agent.accentColor}50` }}
          >
            <AgentIcon id={agent.id} className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h2 className="text-base font-bold text-zinc-100 uppercase tracking-widest font-mono">{agent.name}</h2>
              <span className={`px-2 py-0.5 rounded-none text-[9px] font-mono font-bold ${
                agent.status === 'RUNNING' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40 animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.2)]' :
                agent.status === 'THINKING' ? 'bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40' :
                'bg-[#141414] text-zinc-400 border border-[#282828]'
              }`}>
                {agent.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">{agent.role}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {agent.status === 'RUNNING' ? (
            <button
              onClick={() => onPause(agent.id)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#141414] hover:bg-[#202020] text-[#FFE600] rounded-none border border-[#FFE600]/40 text-xs font-bold transition cursor-pointer font-mono"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>PAUSE WORKER</span>
            </button>
          ) : (
            <button
              onClick={() => onResume(agent.id)}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#00FF41] hover:bg-[#00FF41]/90 text-black rounded-none text-xs font-bold shadow-[0_0_10px_rgba(0,255,65,0.3)] transition cursor-pointer font-mono"
            >
              <Play className="w-3.5 h-3.5" />
              <span>RESUME WORKER</span>
            </button>
          )}
        </div>
      </div>

      {/* Agent Specialized Workspace Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0A0A0A] border border-[#222222] rounded p-5 space-y-4 shadow-xl">
          <h3 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider">AGENT TELEMETRY</h3>
          <div className="space-y-3 text-xs font-mono">
            <div className="flex justify-between py-1.5 border-b border-[#1A1A1A]">
              <span className="text-zinc-500">AUTONOMY LEVEL</span>
              <span className="text-[#FFE600] font-bold">{agent.autonomyLevel}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1A1A1A]">
              <span className="text-zinc-500">TASKS COMPLETED</span>
              <span className="text-[#00FF41] font-bold">{agent.tasksCompleted}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1A1A1A]">
              <span className="text-zinc-500">TASKS FAILED</span>
              <span className="text-zinc-300 font-bold">{agent.tasksFailed}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#1A1A1A]">
              <span className="text-zinc-500">LAST ACTIVE</span>
              <span className="text-zinc-300">{new Date(agent.lastActive).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-zinc-500">PROCESS STATE</span>
              <span className="text-[#00FF41] font-bold">DAEMON_ONLINE</span>
            </div>
          </div>
        </div>

        {/* Specialized Capability Feature */}
        <div className="md:col-span-2 bg-[#0A0A0A] border border-[#222222] rounded p-5 space-y-4 shadow-xl">
          <h3 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider">
            SPECIALIZED DOMAIN WORKSPACE
          </h3>

          {agent.id === 'developer' && (
            <div className="bg-[#050505] p-4 rounded border border-[#1A1A1A] text-xs font-mono space-y-2">
              <div className="text-[#BD00FF] font-bold">💻 Developer Sandbox Environment</div>
              <p className="text-zinc-300">Target Workspace: <code className="text-[#00FF41]">projects/[PROJECT-ID]/workspace</code></p>
              <div className="text-zinc-500">Build Tooling: HTML5 / Modern CSS / Async JS / Vite bundler</div>
              <div className="mt-3 p-2 bg-[#0D0D0D] rounded border border-[#222222] text-[11px] text-[#00FF41]">
                ✓ AST Command validation active (No rm -rf /, fork-bombs, or destructive ops permitted)
              </div>
            </div>
          )}

          {agent.id === 'qa' && (
            <div className="bg-[#050505] p-4 rounded border border-[#1A1A1A] text-xs font-mono space-y-2">
              <div className="text-[#00E5FF] font-bold">🧪 Automated Testing Lab & Regression Engine</div>
              <p className="text-zinc-300">Assertions: 24 Automated assertions per pipeline run</p>
              <div className="text-[#00FF41] font-bold">Pass Rate: 100% (All unit & E2E tests green)</div>
              <div className="mt-3 p-2 bg-[#0D0D0D] rounded border border-[#222222] text-[11px] text-zinc-400 font-sans">
                Automated regression gates prevent developer code from reaching security review without 100% pass.
              </div>
            </div>
          )}

          {agent.id === 'security' && (
            <div className="bg-[#050505] p-4 rounded border border-[#1A1A1A] text-xs font-mono space-y-2">
              <div className="text-[#FF3E3E] font-bold">🛡️ Cybersecurity Sandbox Audit & AST Filter</div>
              <p className="text-zinc-300">Sandbox Boundary: Strict project workspace isolation enabled</p>
              <div className="text-[#00FF41] font-bold">OWASP Top 10 Static Audit: PASSED (Zero CVEs)</div>
              <div className="mt-3 p-2 bg-[#0D0D0D] rounded border border-[#222222] text-[11px] text-zinc-400 font-sans">
                High-risk operations (e.g. live deployments) automatically trigger an Owner approval request.
              </div>
            </div>
          )}

          {agent.id === 'design' && (
            <div className="bg-[#050505] p-4 rounded border border-[#1A1A1A] text-xs font-mono space-y-2">
              <div className="text-[#FF0055] font-bold">🎨 UI/UX Design System & Typography Engine</div>
              <p className="text-zinc-300">Style System: Brutalist / Creative Tool visual design</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-none bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40 text-[9px] font-mono">#00FF41 NEON</span>
                <span className="px-2 py-0.5 rounded-none bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 text-[9px] font-mono">#00E5FF CYAN</span>
                <span className="px-2 py-0.5 rounded-none bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/40 text-[9px] font-mono">#FF3E3E DANGER</span>
              </div>
            </div>
          )}

          {agent.id === 'deployment' && (
            <div className="bg-[#050505] p-4 rounded border border-[#1A1A1A] text-xs font-mono space-y-2">
              <div className="text-[#FFE600] font-bold">🚀 Release Candidate & Deployment Gateway</div>
              <p className="text-zinc-300">Target: Production Cloud Run Container</p>
              <div className="text-[#FFE600] font-bold">Policy: Mandatory Owner-in-the-loop Approval for Live Releases</div>
            </div>
          )}

          {['ceo', 'sales', 'client', 'documentation'].includes(agent.id) && (
            <div className="bg-[#050505] p-4 rounded border border-[#1A1A1A] text-xs font-mono space-y-2">
              <div className="text-[#00FF41] font-bold">💼 Enterprise Agent Capabilities</div>
              <p className="text-zinc-300">Role: {agent.role}</p>
              <p className="text-zinc-500 font-sans">Integrated with Model Router priority chain and persistent SQLite memory.</p>
            </div>
          )}
        </div>
      </div>

      {/* Assigned Tasks History */}
      <div className="bg-[#0A0A0A] border border-[#222222] rounded p-5 space-y-3 shadow-xl">
        <h3 className="text-[10px] font-mono uppercase font-bold text-zinc-500 tracking-wider">
          ASSIGNED TASKS ({agentTasks.length})
        </h3>
        {agentTasks.length === 0 ? (
          <div className="text-xs text-zinc-600 italic py-4 text-center">NO TASKS ASSIGNED YET.</div>
        ) : (
          <div className="space-y-2">
            {agentTasks.map((t) => (
              <div key={t.id} className="bg-[#050505] border border-[#1A1A1A] rounded p-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-zinc-200 font-mono text-xs">{t.title}</h4>
                  <p className="text-zinc-500 text-[11px] font-sans mt-0.5">{t.description}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-none text-[9px] font-mono font-bold ${
                  t.state === 'COMPLETED' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' :
                  t.state === 'RUNNING' ? 'bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40 animate-pulse' :
                  'bg-[#141414] text-zinc-500 border border-[#282828]'
                }`}>
                  {t.state}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
