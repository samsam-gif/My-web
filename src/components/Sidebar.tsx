import React from 'react';
import {
  Crown,
  TrendingUp,
  Users,
  Palette,
  Code,
  CheckCircle,
  ShieldAlert,
  Rocket,
  BookOpen,
  FolderGit2,
  ListTodo,
  ShieldCheck,
  Activity,
  Cpu,
  Smartphone,
  Settings,
  FileText
} from '../lib/icons';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingApprovalsCount
}) => {
  const agentTabs = [
    { id: 'ceo', label: 'CEO Command', icon: Crown, color: 'text-[#FFE600]', badge: 'LEAD' },
    { id: 'sales', label: 'Sales Director', icon: TrendingUp, color: 'text-[#00E5FF]' },
    { id: 'client', label: 'Client Relations', icon: Users, color: 'text-[#00FF41]' },
    { id: 'design', label: 'Design Studio', icon: Palette, color: 'text-[#BD00FF]' },
    { id: 'developer', label: 'Development', icon: Code, color: 'text-[#00E5FF]' },
    { id: 'qa', label: 'QA Lab', icon: CheckCircle, color: 'text-[#00FF41]' },
    { id: 'security', label: 'Cybersecurity', icon: ShieldAlert, color: 'text-[#FF3E3E]' },
    { id: 'deployment', label: 'Deployment', icon: Rocket, color: 'text-[#F27D26]' },
    { id: 'documentation', label: 'Documentation', icon: BookOpen, color: 'text-zinc-400' },
  ];

  const operationsTabs = [
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'tasks', label: 'Tasks Queue', icon: ListTodo },
    { id: 'approvals', label: 'Approvals Center', icon: ShieldCheck, count: pendingApprovalsCount },
    { id: 'logs', label: 'Audit & Telemetry', icon: Activity },
    { id: 'models', label: 'Model Router & AI', icon: Cpu },
    { id: 'android', label: 'Android API Docs', icon: Smartphone, badge: 'READY' },
  ];

  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-[#222222] flex flex-col h-[calc(100vh-57px)] shrink-0 overflow-y-auto font-mono">
      {/* Agents Section */}
      <div className="p-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2.5 px-2">
          AUTONOMOUS AGENTS (9)
        </h2>
        <nav className="space-y-1">
          {agentTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#141414] text-white font-bold border-l-2 border-[#00FF41] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#111111]'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${tab.color || 'text-zinc-400'}`} />
                  <span className="truncate tracking-tight font-sans text-xs">{tab.label}</span>
                </div>
                {tab.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-none bg-[#FFE600]/10 text-[#FFE600] font-bold border border-[#FFE600]/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[#1C1C1C] my-1"></div>

      {/* Operations Section */}
      <div className="p-4 flex-1">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2.5 px-2">
          OPERATIONS & CONTROL
        </h2>
        <nav className="space-y-1">
          {operationsTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs transition cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#141414] text-white font-bold border-l-2 border-[#00E5FF] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#111111]'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0 text-zinc-400" />
                  <span className="truncate tracking-tight font-sans text-xs">{tab.label}</span>
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-none bg-[#FF3E3E] text-black animate-pulse">
                    {tab.count}
                  </span>
                )}
                {tab.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-none bg-[#00FF41]/10 text-[#00FF41] font-bold border border-[#00FF41]/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-[#1C1C1C] bg-[#070707] text-xs text-zinc-500 font-mono">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-zinc-500 tracking-wider">ENGINE</span>
          <span className="text-[10px] text-[#00FF41] font-bold tracking-widest">AUTONOMOUS</span>
        </div>
        <div className="text-[10px] text-zinc-600">
          Source: <span className="text-zinc-400">Deterministic DAG</span>
        </div>
      </div>
    </aside>
  );
};
