'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPortfolio } from '@/lib/types/portfolio';
import { 
  Github, Linkedin, Twitter, Globe, Mail, MapPin, ExternalLink, 
  Sparkles, Briefcase, GraduationCap, Code2, Award, ShieldCheck, Cpu, Zap, ArrowUpRight, User
} from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const AuroraTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#070913] text-slate-100 pb-28 font-sans relative overflow-hidden">
      
      {/* CSS Aurora Mesh Lighting Effects */}
      <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-indigo-600/20 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-[40rem] right-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-pink-500/15 to-blue-600/20 rounded-full blur-[180px] pointer-events-none" />

      {/* Aurora Modern Header Hero */}
      <section className="relative pt-16 pb-20 border-b border-emerald-500/20 bg-gradient-to-b from-[#0C1022] via-[#070913] to-[#070913]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 space-y-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8"
          >
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400">
                <Zap className="w-3.5 h-3.5 text-emerald-400" /> AURORA // AI & NEXT-GEN SAAS ENGINE
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
                {portfolio.fullName}
              </h1>

              <p className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                {portfolio.roleTitle} <span className="text-slate-500 font-normal">@</span> {portfolio.institutionOrCompany}
              </p>

              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-light">
                {portfolio.bio}
              </p>
            </div>

            {/* Floating Aurora Profile Card */}
            <div className="relative shrink-0 w-full lg:w-auto">
              <div className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 space-y-4">
                <div className="flex items-center gap-5">
                  {portfolio.avatarUrl ? (
                    <img
                      src={portfolio.avatarUrl}
                      alt={portfolio.fullName}
                      className="w-24 h-24 rounded-2xl object-cover ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/30 shrink-0"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-emerald-400 ring-2 ring-emerald-400/50 shadow-lg shrink-0">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                      {portfolio.status}
                    </span>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {portfolio.contact.location}
                    </p>
                    <a href={`mailto:${portfolio.contact.email}`} className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> {portfolio.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  {portfolio.socialLinks.github && (
                    <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 transition-all flex-1 flex justify-center">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {portfolio.socialLinks.linkedin && (
                    <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 transition-all flex-1 flex justify-center">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {portfolio.socialLinks.twitter && (
                    <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 transition-all flex-1 flex justify-center" title="Twitter / X">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {portfolio.socialLinks.website && (
                    <a href={portfolio.socialLinks.website} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-slate-700 transition-all flex-1 flex justify-center" title="Personal Website">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Main Body */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-12 space-y-16 relative z-10">
        
        {/* AI & Tech Competency Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> {"// TECHNICAL & AI MATRIX"}
            </h2>
            <span className="text-xs font-mono text-emerald-400">{portfolio.skills.length} MODULES LOADED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolio.skills.map((skill) => (
              <div key={skill.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-200">{skill.name}</span>
                  <span className="text-emerald-400 font-mono text-[11px]">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Projects Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-emerald-400" /> Featured Innovations & Builds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.projects.map((proj) => (
              <div key={proj.id} className="p-7 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all shadow-xl flex flex-col justify-between group">
                <div>
                  {proj.imageUrl && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 border border-slate-800 group-hover:scale-[1.02] transition-transform">
                      <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1.5">{proj.title}</h3>
                  <p className="text-xs font-mono text-emerald-400 mb-3">{proj.tagline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-5">{proj.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-lg text-[10px] font-mono font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                        <ExternalLink className="w-3.5 h-3.5" /> Launch Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications & Badges */}
        {portfolio.certifications && portfolio.certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <Award className="w-4 h-4" /> {"// CERTIFICATIONS & BADGES"}
              </h2>
              <span className="text-xs font-mono text-emerald-400">{portfolio.certifications.length} CREDENTIALS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.certifications.map((cert) => (
                <div key={cert.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-xs">{cert.title}</h3>
                    <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono">{cert.issuer} • {cert.issueDate}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Education & Experiences */}
        {(portfolio.education?.length > 0 || portfolio.experiences?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.education && portfolio.education.length > 0 && (
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> {"// ACADEMIC QUALIFICATIONS"}
                </h2>
                <div className="space-y-4">
                  {portfolio.education.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
                        <span className="text-emerald-400 font-mono text-[11px]">{edu.startYear} – {edu.endYear}</span>
                      </div>
                      <p className="text-xs text-slate-400">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {portfolio.experiences && portfolio.experiences.length > 0 && (
              <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> {"// WORK EXPERIENCE"}
                </h2>
                <div className="space-y-4">
                  {portfolio.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-white">{exp.role}</h3>
                        <span className="text-emerald-400 font-mono text-[11px]">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <p className="text-xs text-slate-300">{exp.company} • {exp.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
