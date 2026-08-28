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
  Terminal,
  FolderGit2,
  ListTodo,
  ShieldCheck,
  Activity,
  Cpu,
  Smartphone,
  Settings,
  FileText,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Server,
  Layers,
  Clock,
  Check,
  X,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Database,
  Lock,
  ArrowRight
} from 'lucide-react';
import { AgentId } from '../types';

export const AgentIcon: React.FC<{ id: AgentId | string; className?: string; size?: number }> = ({ id, className = "w-5 h-5", size = 20 }) => {
  switch (id) {
    case 'ceo':
      return <Crown className={className} size={size} />;
    case 'sales':
      return <TrendingUp className={className} size={size} />;
    case 'client':
      return <Users className={className} size={size} />;
    case 'design':
      return <Palette className={className} size={size} />;
    case 'developer':
      return <Code className={className} size={size} />;
    case 'qa':
      return <CheckCircle className={className} size={size} />;
    case 'security':
      return <ShieldAlert className={className} size={size} />;
    case 'deployment':
      return <Rocket className={className} size={size} />;
    case 'documentation':
      return <BookOpen className={className} size={size} />;
    default:
      return <Cpu className={className} size={size} />;
  }
};

export {
  Crown,
  TrendingUp,
  Users,
  Palette,
  Code,
  CheckCircle,
  ShieldAlert,
  Rocket,
  BookOpen,
  Terminal,
  FolderGit2,
  ListTodo,
  ShieldCheck,
  Activity,
  Cpu,
  Smartphone,
  Settings,
  FileText,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Server,
  Layers,
  Clock,
  Check,
  X,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Database,
  Lock,
  ArrowRight
};
