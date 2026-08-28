import React, { useState } from 'react';
import { Task, TaskState } from '../types';
import { AgentIcon, RotateCcw, CheckCircle, Clock, ShieldAlert, AlertTriangle, FileText } from '../lib/icons';

interface TasksViewProps {
  tasks: Task[];
  onRetryTask: (taskId: string) => Promise<void>;
}

export const TasksView: React.FC<TasksViewProps> = ({ tasks, onRetryTask }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const filteredTasks = tasks.filter(t => {
    if (filter === 'ALL') return true;
    return t.state === filter;
  });

  const handleRetry = async (taskId: string) => {
    setRetryingId(taskId);
    try {
      await onRetryTask(taskId);
    } finally {
      setRetryingId(null);
    }
  };

  const getStateBadge = (state: TaskState) => {
    switch (state) {
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40 shadow-[0_0_8px_rgba(0,255,65,0.15)]">COMPLETED</span>;
      case 'RUNNING':
        return <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40 animate-pulse">RUNNING</span>;
      case 'NEEDS_APPROVAL':
        return <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/40 animate-pulse">APPROVAL GATED</span>;
      case 'QUEUED':
        return <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40">QUEUED</span>;
      case 'FAILED':
        return <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/50">FAILED</span>;
      default:
        return <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#141414] text-zinc-500 border border-[#282828]">PENDING</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">
            TASKS QUEUE & DEPENDENCY GRAPH // DISPATCH LOG
          </h2>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">Deterministic pipeline execution with automated retry limits</p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center space-x-1 bg-[#0A0A0A] p-1 rounded-none border border-[#222222] text-xs">
          {['ALL', 'RUNNING', 'NEEDS_APPROVAL', 'QUEUED', 'COMPLETED', 'FAILED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-2.5 py-1 rounded-none font-mono text-[11px] transition cursor-pointer ${
                filter === st ? 'bg-[#141414] text-[#00FF41] font-bold border border-[#00FF41]/40' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-[#0A0A0A] border border-[#222222] hover:border-[#383838] rounded p-4 transition shadow-md"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-[#141414] flex items-center justify-center text-zinc-300 border border-[#282828]">
                  <AgentIcon id={task.assignedAgent} className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-xs text-zinc-100 font-mono tracking-tight">{task.title}</h3>
                    <span className="text-[10px] font-mono text-zinc-500">({task.id})</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">{task.description}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Risk Badge */}
                <span className={`px-2 py-0.5 rounded-none text-[9px] font-mono font-bold ${
                  task.riskLevel === 'HIGH' ? 'bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/40' :
                  task.riskLevel === 'MEDIUM' ? 'bg-[#FFE600]/20 text-[#FFE600] border border-[#FFE600]/40' :
                  'bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30'
                }`}>
                  RISK: {task.riskLevel}
                </span>

                {getStateBadge(task.state)}
              </div>
            </div>

            {/* Output Summary & Artifacts if available */}
            {task.outputSummary && (
              <div className="mt-3 bg-[#050505] border border-[#1A1A1A] rounded p-3 text-xs">
                <span className="text-zinc-500 font-mono text-[9px] uppercase font-bold block mb-1 tracking-wider">OUTPUT ARTIFACT:</span>
                <p className="text-[#00FF41]/90 leading-relaxed font-mono text-xs">{task.outputSummary}</p>
                {task.artifacts && task.artifacts.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap pt-2 border-t border-[#141414]">
                    <span className="text-zinc-600 text-[10px] font-mono">FILES:</span>
                    {task.artifacts.map((art, i) => (
                      <span key={i} className="flex items-center space-x-1 px-2 py-0.5 rounded-none bg-[#101010] border border-[#222222] text-zinc-300 text-[10px] font-mono">
                        <FileText className="w-3 h-3 text-[#FFE600]" />
                        <span>{art}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Footer details */}
            <div className="mt-3 pt-2.5 border-t border-[#1C1C1C] flex items-center justify-between text-xs text-zinc-500 font-mono">
              <div className="flex items-center space-x-4 text-[11px]">
                <span>AGENT: <strong className="text-zinc-300 uppercase">{task.assignedAgent}</strong></span>
                {task.dependencies && task.dependencies.length > 0 && (
                  <span>DEPS: <strong className="text-[#00E5FF]">{task.dependencies.join(', ')}</strong></span>
                )}
                <span>RETRIES: {task.retryCount}/{task.maxRetries}</span>
              </div>

              {task.state === 'FAILED' && task.retryCount < task.maxRetries && (
                <button
                  onClick={() => handleRetry(task.id)}
                  disabled={retryingId === task.id}
                  className="flex items-center space-x-1.5 px-3 py-1 bg-[#141414] hover:bg-[#202020] text-[#FFE600] rounded-none border border-[#FFE600]/40 text-xs transition cursor-pointer font-bold font-mono"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RETRY TASK</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
