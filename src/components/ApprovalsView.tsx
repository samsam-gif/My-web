import React, { useState } from 'react';
import { ApprovalRequest } from '../types';
import { ShieldCheck, ShieldAlert, Check, X, Clock, AlertTriangle, FileText } from '../lib/icons';

interface ApprovalsViewProps {
  approvals: ApprovalRequest[];
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason?: string) => Promise<void>;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({
  approvals,
  onApprove,
  onReject
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const pendingApprovals = approvals.filter(a => a.status === 'PENDING');
  const resolvedApprovals = approvals.filter(a => a.status !== 'PENDING');

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      await onApprove(id);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt("Enter rejection reason (optional):") || "Rejected by Owner";
    setProcessingId(id);
    try {
      await onReject(id, reason);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-mono">
      <div>
        <h2 className="text-sm font-bold text-zinc-100 flex items-center space-x-2 uppercase tracking-widest">
          <ShieldAlert className="w-5 h-5 text-[#FF3E3E]" />
          <span>GOVERNANCE & HIGH-RISK APPROVALS CENTER // ROOT GATING</span>
        </h2>
        <p className="text-xs text-zinc-500 font-sans mt-0.5">Owner-in-the-loop authorization for production deployments, mutations, and financial actions</p>
      </div>

      {/* Pending Approvals Section */}
      <div className="space-y-3">
        <h3 className="text-[10px] uppercase font-mono font-bold text-[#FFE600] tracking-wider px-1">
          PENDING AUTHORIZATION ({pendingApprovals.length})
        </h3>

        {pendingApprovals.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-[#222222] rounded p-8 text-center text-zinc-500">
            <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-[#00FF41] stroke-1" />
            <p className="text-xs font-bold text-zinc-300">ALL CLEAR // ZERO PENDING GATES</p>
            <p className="text-xs text-zinc-500 font-sans mt-1">Autonomous workers will request Owner authorization prior to executing high-risk operations.</p>
          </div>
        ) : (
          pendingApprovals.map((req) => (
            <div
              key={req.id}
              className="bg-[#0A0A0A] border-2 border-[#FF3E3E]/60 rounded p-5 shadow-2xl space-y-4 shadow-[#FF3E3E]/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/50">
                      CRITICAL RISK
                    </span>
                    <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#141414] text-zinc-300 border border-[#282828]">
                      {req.actionType}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      AGENT: <strong className="text-[#FFE600] uppercase">{req.agentId}</strong>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-100 mt-2 font-mono">{req.title}</h4>
                  <p className="text-xs text-zinc-400 font-sans mt-1 leading-relaxed">{req.description}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleReject(req.id)}
                    disabled={processingId === req.id}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-[#141414] hover:bg-[#202020] text-[#FF3E3E] border border-[#FF3E3E]/50 rounded-none text-xs font-bold transition cursor-pointer font-mono"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>REJECT</span>
                  </button>

                  <button
                    onClick={() => handleApprove(req.id)}
                    disabled={processingId === req.id}
                    className="flex items-center space-x-1 px-3.5 py-1.5 bg-[#00FF41] hover:bg-[#00FF41]/90 text-black rounded-none text-xs font-bold shadow-[0_0_10px_rgba(0,255,65,0.3)] transition cursor-pointer font-mono"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>APPROVE & EXECUTE</span>
                  </button>
                </div>
              </div>

              {/* Payload details */}
              <div className="bg-[#050505] border border-[#1C1C1C] rounded p-3 text-xs font-mono">
                <span className="text-zinc-500 text-[9px] uppercase font-bold block mb-1 tracking-wider">PAYLOAD PARAMETERS:</span>
                <pre className="text-[#00FF41]/90 overflow-x-auto whitespace-pre-wrap text-xs">{JSON.stringify(req.payload, null, 2)}</pre>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolved Approvals History */}
      {resolvedApprovals.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-[#1C1C1C]">
          <h3 className="text-[10px] uppercase font-mono font-bold text-zinc-500 tracking-wider px-1">
            AUDIT HISTORY ({resolvedApprovals.length})
          </h3>
          <div className="space-y-2">
            {resolvedApprovals.map((req) => (
              <div
                key={req.id}
                className="bg-[#0A0A0A] border border-[#222222] rounded p-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-0.5 rounded-none text-[9px] font-mono font-bold ${
                    req.status === 'APPROVED' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/30' : 'bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/30'
                  }`}>
                    {req.status}
                  </span>
                  <div>
                    <span className="font-bold text-zinc-200">{req.title}</span>
                    <span className="text-zinc-500 text-[11px] ml-2 font-mono">by {req.resolvedBy || 'OWNER'}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">{req.resolvedAt ? new Date(req.resolvedAt).toLocaleTimeString() : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
