export type AgentId = 
  | 'ceo' 
  | 'sales' 
  | 'client' 
  | 'design' 
  | 'developer' 
  | 'qa' 
  | 'security' 
  | 'deployment' 
  | 'documentation';

export type AgentStatus = 'RUNNING' | 'WAITING' | 'THINKING' | 'NEEDS_APPROVAL' | 'ERROR' | 'IDLE';

export type TaskState = 
  | 'PENDING' 
  | 'QUEUED' 
  | 'RUNNING' 
  | 'WAITING' 
  | 'NEEDS_APPROVAL' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
  currentTaskId?: string;
  currentTaskTitle?: string;
  progress: number; // 0 to 100
  lastAction: string;
  lastActive: string;
  tasksCompleted: number;
  tasksFailed: number;
  avatarIcon: string;
  accentColor: string;
  autonomyLevel: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedAgent: AgentId;
  state: TaskState;
  progress: number;
  riskLevel: RiskLevel;
  dependencies: string[]; // IDs of tasks that must complete before this runs
  retryCount: number;
  maxRetries: number;
  outputSummary?: string;
  artifacts?: string[];
  error?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'NEEDS_APPROVAL' | 'TESTING' | 'COMPLETED' | 'FAILED';
  progress: number;
  ownerCommand: string;
  createdAt: string;
  updatedAt: string;
  taskIds: string[];
  workspacePath: string;
  files: ProjectFile[];
  metrics: {
    totalTasks: number;
    completedTasks: number;
    testCoverage: number;
    securityScore: number;
  };
}

export interface ProjectFile {
  name: string;
  path: string;
  size: number;
  type: string;
  content: string;
  lastModified: string;
}

export interface ApprovalRequest {
  id: string;
  projectId: string;
  taskId: string;
  agentId: AgentId;
  title: string;
  description: string;
  actionType: 'DEPLOYMENT' | 'DEPENDENCY_INSTALL' | 'SOURCE_MUTATION' | 'EXTERNAL_API' | 'COMMAND_EXECUTION';
  riskLevel: RiskLevel;
  status: ApprovalStatus;
  payload: Record<string, any>;
  requestedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  rejectionReason?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'SECURITY' | 'APPROVAL';
  agentId?: AgentId;
  projectId?: string;
  taskId?: string;
  message: string;
  details?: Record<string, any>;
}

export interface ModelProvider {
  id: string;
  name: string;
  model: string;
  priority: number;
  enabled: boolean;
  status: 'ONLINE' | 'STANDBY' | 'NOT_CONFIGURED' | 'ERROR';
  totalRequests: number;
  avgLatencyMs: number;
  tokenUsage: number;
  lastUsed?: string;
}

export interface SystemHealth {
  status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  uptimeSeconds: number;
  activeAgentsCount: number;
  totalProjectsCount: number;
  pendingApprovalsCount: number;
  databaseStatus: 'CONNECTED' | 'DISCONNECTED';
  workerPoolStatus: 'ACTIVE' | 'PAUSED' | 'STOPPED';
  activeModelProvider: string;
  memoryUsageMb: number;
  diskFreeGb: number;
}

export interface RealTimeEvent {
  type: 
    | 'agent.started'
    | 'agent.progress'
    | 'agent.completed'
    | 'agent.failed'
    | 'agent.status_change'
    | 'task.created'
    | 'task.updated'
    | 'task.completed'
    | 'task.failed'
    | 'project.created'
    | 'project.updated'
    | 'approval.required'
    | 'approval.completed'
    | 'system.health'
    | 'log.created';
  data: any;
  timestamp: string;
}
