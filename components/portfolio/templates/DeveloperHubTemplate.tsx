'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPortfolio } from '@/lib/types/portfolio';
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, ExternalLink, Terminal, Code2, Cpu, GitBranch, ShieldCheck, Star, GitFork, FileCode, Briefcase } from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const DeveloperHubTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100 pb-24 font-mono">
      
      {/* IDE macOS Style Top Bar */}
      <div className="bg-[#161B22] border-b border-[#30363D] px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 cursor-pointer" />
          </div>
          <span className="ml-4 text-xs text-slate-400 font-sans flex items-center gap-2">
            <FileCode className="w-3.5 h-3.5 text-blue-400" /> developer-hub ~ {portfolio.username}.config.ts
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-emerald-400 font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5" /> main • v2.4.0
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
        
        {/* Developer Terminal Profile Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 rounded-2xl bg-[#161B22] border border-[#30363D] shadow-2xl space-y-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {portfolio.avatarUrl ? (
                <img
                  src={portfolio.avatarUrl}
                  alt={portfolio.fullName}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-emerald-500/60"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-500/60 ring-2 ring-emerald-500/60">
                  <span className="font-mono text-xl font-bold text-emerald-400">&lt;/&gt;</span>
                </div>
              )}
              <div className="space-y-1.5 font-sans">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono">{portfolio.fullName}</h1>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    {portfolio.status}
                  </span>
                </div>
                <p className="text-sm font-mono text-emerald-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> {portfolio.roleTitle}
                </p>
                <p className="text-xs text-slate-400 font-mono">
                  const location = &quot;{portfolio.contact.location}&quot;;
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {portfolio.socialLinks.github && (
                <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-300 border border-[#30363D] transition-colors" title="GitHub">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.linkedin && (
                <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-300 border border-[#30363D] transition-colors" title="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.twitter && (
                <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-300 border border-[#30363D] transition-colors" title="Twitter / X">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.website && (
                <a href={portfolio.socialLinks.website} target="_blank" rel="noreferrer" className="p-3 rounded-xl bg-[#21262D] hover:bg-[#30363D] text-slate-300 border border-[#30363D] transition-colors" title="Personal Website">
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] text-xs leading-relaxed text-slate-300 font-mono">
            <span className="text-emerald-400">{"// developer summary"}</span>
            <p className="mt-1 font-sans text-slate-300">{portfolio.bio}</p>
          </div>
        </motion.div>

        {/* Technical Modules Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-4"
        >
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span className="flex items-center gap-2 font-bold"><Cpu className="w-4 h-4" /> export const SKILL_MODULES = [</span>
            <span className="text-slate-400 font-mono">{portfolio.skills.length} MODULES LOADED</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {portfolio.skills.map((skill) => (
              <div key={skill.id} className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D]">
                <div className="flex justify-between items-center text-xs mb-1.5 font-sans font-bold">
                  <span className="text-white">{skill.name}</span>
                  <span className="text-emerald-400 font-mono">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1 bg-[#21262D] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* GitHub Repositories Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-emerald-400 font-bold flex items-center gap-2 text-sm">
              <Code2 className="w-4 h-4" /> repositories.map((project) =&gt; (
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.projects.map((proj, idx) => (
              <div key={proj.id} className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-white font-sans flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-emerald-400" /> {proj.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {12 + idx * 7}</span>
                      <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {3 + idx * 2}</span>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-400 mb-2">{proj.tagline}</p>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed mb-4">{proj.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded text-[10px] bg-[#21262D] text-emerald-300 border border-[#30363D]">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-[#30363D]">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 rounded-lg text-xs bg-[#21262D] hover:bg-[#30363D] text-slate-200 flex items-center gap-1.5 border border-[#30363D]">
                        <Github className="w-3.5 h-3.5" /> Repo
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="px-3.5 py-1.5 rounded-lg text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" /> Live Build
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Work Experience */}
        {portfolio.experiences && portfolio.experiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-4"
          >
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-2 font-mono">
              <Briefcase className="w-4 h-4 text-emerald-400" /> work_experience.log
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              {portfolio.experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <p className="font-bold text-emerald-300">{exp.role}</p>
                    <span className="text-[10px] text-slate-500 font-mono">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">{exp.company} • {exp.location}</p>
                  <p className="text-[11px] text-slate-400 pt-1 font-sans leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Certifications & Education */}
        {(portfolio.certifications?.length > 0 || portfolio.education?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.certifications && portfolio.certifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-4"
              >
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> certifications.json
                </span>
                <div className="space-y-3 font-mono text-xs">
                  {portfolio.certifications.map((cert) => (
                    <div key={cert.id} className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                      <p className="font-bold text-white">{cert.title}</p>
                      <p className="text-[11px] text-slate-400">{cert.issuer} • {cert.issueDate}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {portfolio.education && portfolio.education.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 rounded-2xl bg-[#161B22] border border-[#30363D] space-y-4"
              >
                <span className="text-emerald-400 font-bold text-xs flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> education.config
                </span>
                <div className="space-y-3 font-mono text-xs">
                  {portfolio.education.map((edu) => (
                    <div key={edu.id} className="p-3.5 rounded-xl bg-[#0D1117] border border-[#30363D] space-y-1">
                      <p className="font-bold text-white">{edu.degree} in {edu.fieldOfStudy}</p>
                      <p className="text-[11px] text-slate-400">{edu.institution} ({edu.startYear} – {edu.endYear})</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
