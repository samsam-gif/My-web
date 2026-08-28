import { Project, Task, Agent, ApprovalRequest, AuditLog, ModelProvider, SystemHealth, RealTimeEvent } from '../types';

export const API_BASE = '/api';

export async function fetchHealth(): Promise<SystemHealth> {
  const res = await fetch(`${API_BASE}/system/health`);
  if (!res.ok) throw new Error('Failed to fetch system health');
  return res.json();
}

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export async function createProject(command: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ command }),
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

export async function fetchTasks(projectId?: string): Promise<Task[]> {
  const url = projectId ? `${API_BASE}/tasks?projectId=${encodeURIComponent(projectId)}` : `${API_BASE}/tasks`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function retryTask(taskId: string): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${taskId}/retry`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to retry task');
  return res.json();
}

export async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch(`${API_BASE}/agents`);
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

export async function pauseAgent(agentId: string): Promise<Agent> {
  const res = await fetch(`${API_BASE}/agents/${agentId}/pause`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to pause agent');
  return res.json();
}

export async function resumeAgent(agentId: string): Promise<Agent> {
  const res = await fetch(`${API_BASE}/agents/${agentId}/resume`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to resume agent');
  return res.json();
}

export async function fetchApprovals(): Promise<ApprovalRequest[]> {
  const res = await fetch(`${API_BASE}/approvals`);
  if (!res.ok) throw new Error('Failed to fetch approvals');
  return res.json();
}

export async function approveAction(approvalId: string): Promise<ApprovalRequest> {
  const res = await fetch(`${API_BASE}/approvals/${approvalId}/approve`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to approve action');
  return res.json();
}

export async function rejectAction(approvalId: string, reason?: string): Promise<ApprovalRequest> {
  const res = await fetch(`${API_BASE}/approvals/${approvalId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  if (!res.ok) throw new Error('Failed to reject action');
  return res.json();
}

export async function fetchLogs(): Promise<AuditLog[]> {
  const res = await fetch(`${API_BASE}/logs`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

export async function fetchModelStats(): Promise<{
  providers: ModelProvider[];
  activeProvider: string;
  totalRequests: number;
  totalTokens: number;
}> {
  const res = await fetch(`${API_BASE}/models`);
  if (!res.ok) throw new Error('Failed to fetch model info');
  return res.json();
}
