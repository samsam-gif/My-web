"""
Data schemas and models for AI Company Command Center.
Compatible with Python 3.10+ and Pydantic v2/dataclasses.
"""
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class AgentId(str, Enum):
    CEO = "ceo"
    SALES = "sales"
    CLIENT = "client"
    DESIGN = "design"
    DEVELOPER = "developer"
    QA = "qa"
    SECURITY = "security"
    DEPLOYMENT = "deployment"
    DOCUMENTATION = "documentation"

class AgentStatus(str, Enum):
    RUNNING = "RUNNING"
    WAITING = "WAITING"
    THINKING = "THINKING"
    NEEDS_APPROVAL = "NEEDS_APPROVAL"
    ERROR = "ERROR"
    IDLE = "IDLE"

class TaskState(str, Enum):
    PENDING = "PENDING"
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    WAITING = "WAITING"
    NEEDS_APPROVAL = "NEEDS_APPROVAL"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class ApprovalStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"

class TaskModel(BaseModel):
    id: str
    project_id: str
    title: str
    description: str
    assigned_agent: AgentId
    state: TaskState = TaskState.PENDING
    progress: int = 0
    risk_level: RiskLevel = RiskLevel.LOW
    dependencies: List[str] = Field(default_factory=list)
    retry_count: int = 0
    max_retries: int = 3
    output_summary: Optional[str] = None
    artifacts: List[str] = Field(default_factory=list)
    error: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    completed_at: Optional[str] = None

class ProjectFile(BaseModel):
    name: str
    path: str
    size: int
    type: str
    content: str
    last_modified: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ProjectModel(BaseModel):
    id: str
    name: str
    description: str
    status: str = "PLANNING"
    progress: int = 0
    owner_command: str
    workspace_path: str
    task_ids: List[str] = Field(default_factory=list)
    files: List[ProjectFile] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ApprovalRequestModel(BaseModel):
    id: str
    project_id: str
    task_id: str
    agent_id: AgentId
    title: str
    description: str
    action_type: str
    risk_level: RiskLevel = RiskLevel.HIGH
    status: ApprovalStatus = ApprovalStatus.PENDING
    payload: Dict[str, Any] = Field(default_factory=dict)
    requested_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    resolved_at: Optional[str] = None
    resolved_by: Optional[str] = None
    rejection_reason: Optional[str] = None

class AuditLogModel(BaseModel):
    id: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    level: str = "INFO"
    agent_id: Optional[AgentId] = None
    project_id: Optional[str] = None
    task_id: Optional[str] = None
    message: str
    details: Dict[str, Any] = Field(default_factory=dict)
