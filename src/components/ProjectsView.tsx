import React, { useState } from 'react';
import { Project, ProjectFile } from '../types';
import { FolderGit2, FileText, CheckCircle, Clock, ShieldCheck, Terminal, ExternalLink } from '../lib/icons';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject?: (project: Project) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(projects[0]?.files?.[0] || null);

  return (
    <div className="space-y-6 pb-12 font-mono">
      <div>
        <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest">
          PROJECT WORKSPACES & REPOSITORIES // ISOLATED STORAGE
        </h2>
        <p className="text-xs text-zinc-500 font-sans mt-0.5">Isolated workspace directories under <code className="text-[#00FF41] font-mono">projects/[id]/workspace/</code></p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="space-y-3">
          <h3 className="text-[10px] uppercase font-mono font-bold text-zinc-500 tracking-wider px-1">
            ACTIVE DIRECTORIES ({projects.length})
          </h3>
          {projects.map((proj) => {
            const isSelected = selectedProject?.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => {
                  setSelectedProject(proj);
                  setActiveFile(proj.files?.[0] || null);
                }}
                className={`p-4 rounded border transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#141414] border-[#00FF41] shadow-[0_0_12px_rgba(0,255,65,0.15)]'
                    : 'bg-[#0A0A0A] border-[#222222] hover:border-[#383838]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2.5">
                    <FolderGit2 className="w-4 h-4 text-[#00FF41] shrink-0" />
                    <h4 className="font-bold text-xs text-zinc-100 font-mono tracking-tight">{proj.name}</h4>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-none ${
                    proj.status === 'COMPLETED' ? 'bg-[#00FF41]/20 text-[#00FF41] border border-[#00FF41]/40' :
                    proj.status === 'NEEDS_APPROVAL' ? 'bg-[#FF3E3E]/20 text-[#FF3E3E] border border-[#FF3E3E]/40' :
                    'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40'
                  }`}>
                    {proj.status}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-sans line-clamp-2 mb-3">{proj.ownerCommand}</p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>PIPELINE PROGRESS</span>
                    <span className="text-zinc-200 font-bold">{proj.progress}%</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A] h-1.5 rounded-none overflow-hidden">
                    <div className="bg-[#00FF41] h-full rounded-none shadow-[0_0_6px_#00FF41]" style={{ width: `${proj.progress}%` }} />
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1C1C1C] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                  <span>TASKS: {proj.taskIds?.length || 6}</span>
                  <span>FILES: {proj.files?.length || 3}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Project Workspace Explorer & File Preview */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#222222] rounded overflow-hidden flex flex-col h-[600px] shadow-2xl">
          {selectedProject ? (
            <>
              {/* Header */}
              <div className="p-4 bg-[#050505] border-b border-[#222222] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs text-zinc-100 flex items-center space-x-2 font-mono">
                    <span>{selectedProject.name}</span>
                    <span className="text-[11px] font-mono text-zinc-500">({selectedProject.workspacePath})</span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans mt-0.5">Prompt: "{selectedProject.ownerCommand}"</p>
                </div>
              </div>

              {/* File Explorer Bar */}
              <div className="bg-[#0A0A0A] border-b border-[#1C1C1C] px-4 py-2 flex items-center space-x-2 overflow-x-auto text-xs font-mono">
                <span className="text-[10px] text-zinc-500 uppercase mr-2 font-bold tracking-wider">FILES:</span>
                {selectedProject.files && selectedProject.files.length > 0 ? (
                  selectedProject.files.map((file) => (
                    <button
                      key={file.name}
                      onClick={() => setActiveFile(file)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-none transition cursor-pointer font-mono text-xs ${
                        activeFile?.name === file.name
                          ? 'bg-[#141414] text-[#00FF41] font-bold border border-[#00FF41]/50 shadow-[0_0_8px_rgba(0,255,65,0.15)]'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#111111] border border-transparent'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{file.name}</span>
                    </button>
                  ))
                ) : (
                  <span className="text-zinc-600 text-xs italic">No workspace files generated yet.</span>
                )}
              </div>

              {/* File Content Preview */}
              <div className="flex-1 p-4 bg-[#050505] overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed select-text shadow-inner">
                {activeFile ? (
                  <pre className="whitespace-pre-wrap font-mono text-xs text-[#00FF41]/90">{activeFile.content}</pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-600">
                    <FileText className="w-8 h-8 mb-2 stroke-1" />
                    <span>Select a file above to inspect source code.</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-600 text-xs font-mono">
              Select a project to inspect workspace files.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
