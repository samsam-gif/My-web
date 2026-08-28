import React, { useState, useEffect, useCallback } from 'react';
import {
  Project,
  Task,
  Agent,
  ApprovalRequest,
  AuditLog,
  ModelProvider,
  SystemHealth,
  RealTimeEvent,
  AgentId
} from './types';
import {
  fetchHealth,
  fetchProjects,
  fetchTasks,
  fetchAgents,
  fetchApprovals,
  fetchLogs,
  fetchModelStats,
  createProject,
  retryTask,
  pauseAgent,
  resumeAgent,
  approveAction,
  rejectAction
} from './services/api';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CEOView } from './components/CEOView';
import { ProjectsView } from './components/ProjectsView';
import { TasksView } from './components/TasksView';
import { ApprovalsView } from './components/ApprovalsView';
import { AgentDetailView } from './components/AgentDetailView';
import { LogsView } from './components/LogsView';
import { ModelRouterView } from './components/ModelRouterView';
import { AndroidApiView } from './components/AndroidApiView';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('ceo');
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [modelStats, setModelStats] = useState<{
    providers: ModelProvider[];
    activeProvider: string;
    totalRequests: number;
    totalTokens: number;
  }>({
    providers: [],
    activeProvider: 'gemini',
    totalRequests: 0,
    totalTokens: 0
  });

  const [wsConnected, setWsConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Load all initial state from backend
  const loadData = useCallback(async () => {
    try {
      const [h, p, t, a, apprs, l, m] = await Promise.all([
        fetchHealth().catch(() => null),
        fetchProjects().catch(() => []),
        fetchTasks().catch(() => []),
        fetchAgents().catch(() => []),
        fetchApprovals().catch(() => []),
        fetchLogs().catch(() => []),
        fetchModelStats().catch(() => ({ providers: [], activeProvider: 'gemini', totalRequests: 0, totalTokens: 0 }))
      ]);

      if (h) setHealth(h);
      setProjects(p);
      setTasks(t);
      setAgents(a);
      setApprovals(apprs);
      setLogs(l);
      setModelStats(m);
    } catch (err) {
      console.error('Error loading initial telemetry:', err);
    }
  }, []);

  // WebSocket Live Connection
  useEffect(() => {
    loadData();

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    let ws: WebSocket | null = null;
    let reconnectTimeout: any = null;

    function connect() {
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setWsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const message: RealTimeEvent = JSON.parse(event.data);
            handleRealTimeEvent(message);
          } catch (e) {
            // Ignore parse errors
          }
        };

        ws.onclose = () => {
          setWsConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          setWsConnected(false);
          ws?.close();
        };
      } catch (err) {
        setWsConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    }

    connect();

    // Polling fallback every 6 seconds
    const interval = setInterval(loadData, 6000);

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(interval);
    };
  }, [loadData]);

  // Handle incoming real-time socket events
  const handleRealTimeEvent = (event: RealTimeEvent) => {
    switch (event.type) {
      case 'project.created':
        setProjects((prev) => [event.data, ...prev.filter(p => p.id !== event.data.id)]);
        break;
      case 'project.updated':
        setProjects((prev) => prev.map((p) => (p.id === event.data.id ? event.data : p)));
        break;
      case 'task.created':
        setTasks((prev) => [...prev.filter(t => t.id !== event.data.id), event.data]);
        break;
      case 'task.updated':
      case 'task.completed':
      case 'task.failed':
        setTasks((prev) => prev.map((t) => (t.id === event.data.id ? event.data : t)));
        break;
      case 'agent.started':
      case 'agent.progress':
      case 'agent.completed':
      case 'agent.status_change':
        setAgents((prev) => prev.map((a) => (a.id === event.data.id ? event.data : a)));
        break;
      case 'approval.required':
        setApprovals((prev) => [event.data, ...prev.filter(a => a.id !== event.data.id)]);
        break;
      case 'approval.completed':
        setApprovals((prev) => prev.map((a) => (a.id === event.data.id ? event.data : a)));
        break;
      case 'log.created':
        setLogs((prev) => [event.data, ...prev.slice(0, 199)]);
        break;
      case 'system.health':
        setHealth(event.data);
        break;
      default:
        break;
    }
  };

  // Actions
  const handleExecuteCommand = async (command: string) => {
    setLoading(true);
    try {
      const newProj = await createProject(command);
      setProjects((prev) => [newProj, ...prev]);
      await loadData();
    } catch (err: any) {
      alert(`Error orchestrating project: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePauseAgent = async (agentId: string) => {
    try {
      const updated = await pauseAgent(agentId);
      setAgents((prev) => prev.map((a) => (a.id === agentId ? updated : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResumeAgent = async (agentId: string) => {
    try {
      const updated = await resumeAgent(agentId);
      setAgents((prev) => prev.map((a) => (a.id === agentId ? updated : a)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRetryTask = async (taskId: string) => {
    try {
      const updated = await retryTask(taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    } catch (err: any) {
      alert(`Retry failed: ${err.message}`);
    }
  };

  const handleApprove = async (approvalId: string) => {
    try {
      const updated = await approveAction(approvalId);
      setApprovals((prev) => prev.map((a) => (a.id === approvalId ? updated : a)));
      await loadData();
    } catch (err: any) {
      alert(`Approve failed: ${err.message}`);
    }
  };

  const handleReject = async (approvalId: string, reason?: string) => {
    try {
      const updated = await rejectAction(approvalId, reason);
      setApprovals((prev) => prev.map((a) => (a.id === approvalId ? updated : a)));
      await loadData();
    } catch (err: any) {
      alert(`Reject failed: ${err.message}`);
    }
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length;
  const currentAgent = agents.find((a) => a.id === activeTab);

  return (
    <div className="min-h-screen bg-black bg-grid-pattern text-zinc-100 flex flex-col font-sans selection:bg-[#00FF41] selection:text-black">
      {/* Top Header */}
      <Header
        health={health}
        wsConnected={wsConnected}
        onRefresh={loadData}
        pendingApprovalsCount={pendingApprovalsCount}
        onSelectTab={setActiveTab}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'ceo' && (
            <CEOView
              agents={agents}
              projects={projects}
              tasks={tasks}
              approvals={approvals}
              health={health}
              onExecuteCommand={handleExecuteCommand}
              onPauseAgent={handlePauseAgent}
              onResumeAgent={handleResumeAgent}
              onSelectAgent={(agentId) => setActiveTab(agentId)}
              onSelectTab={setActiveTab}
              loading={loading}
            />
          )}

          {activeTab === 'projects' && <ProjectsView projects={projects} />}

          {activeTab === 'tasks' && (
            <TasksView tasks={tasks} onRetryTask={handleRetryTask} />
          )}

          {activeTab === 'approvals' && (
            <ApprovalsView
              approvals={approvals}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {activeTab === 'logs' && <LogsView logs={logs} />}

          {activeTab === 'models' && (
            <ModelRouterView
              providers={modelStats.providers}
              activeProvider={modelStats.activeProvider}
              totalRequests={modelStats.totalRequests}
              totalTokens={modelStats.totalTokens}
            />
          )}

          {activeTab === 'android' && <AndroidApiView />}

          {/* Individual Agent Workstations */}
          {currentAgent && (
            <AgentDetailView
              agent={currentAgent}
              tasks={tasks}
              projects={projects}
              onPause={handlePauseAgent}
              onResume={handleResumeAgent}
            />
          )}
        </main>
      </div>
    </div>
  );
}
