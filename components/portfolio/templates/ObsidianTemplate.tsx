'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPortfolio } from '@/lib/types/portfolio';
import { 
  Github, Linkedin, Twitter, Globe, Mail, MapPin, ExternalLink, 
  Award, CheckCircle2, Sparkles, Briefcase, GraduationCap, Code2, Terminal, ShieldCheck, ArrowRight, User
} from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const ObsidianTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 pb-28 font-sans relative overflow-hidden">
      
      {/* Cinematic Glowing Background Orbs */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-[30rem] right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Cinematic Oversized Hero Section */}
      <section className="relative pt-20 pb-16 border-b border-cyan-500/20 bg-gradient-to-b from-[#080E1E] via-[#050811] to-[#050811]">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-400">
              <Terminal className="w-3.5 h-3.5" /> OBSIDIAN // CINEMATIC DEVELOPER PORTFOLIO
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-[1.05]">
              {portfolio.fullName}
            </h1>

            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent max-w-3xl">
              {portfolio.roleTitle} <span className="text-slate-500 font-normal">at</span> {portfolio.institutionOrCompany}
            </p>
          </motion.div>

          {/* Floating Profile Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6 text-left">
              {portfolio.avatarUrl ? (
                <img
                  src={portfolio.avatarUrl}
                  alt={portfolio.fullName}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/30 shrink-0"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400/60 ring-2 ring-cyan-400/50 shadow-xl shrink-0">
                  <User className="w-12 h-12" />
                </div>
              )}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase">
                    {portfolio.status}
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-2 pt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> {portfolio.contact.location}
                </p>
                <a href={`mailto:${portfolio.contact.email}`} className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> {portfolio.contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {portfolio.socialLinks.github && (
                <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.linkedin && (
                <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.twitter && (
                <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all" title="Twitter / X">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.website && (
                <a href={portfolio.socialLinks.website} target="_blank" rel="noreferrer" className="p-3.5 rounded-2xl bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700 hover:border-cyan-500/50 transition-all" title="Personal Website">
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

        </div>
      </section>

      {/* Main Body Content */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-12 space-y-16 relative z-10">
        
        {/* Executive Biography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl"
        >
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> {"// ABOUT & BIOGRAPHY"}
          </h2>
          <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-light">
            {portfolio.bio}
          </p>
        </motion.div>

        {/* Featured Full-Width Projects Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-cyan-400" /> Featured Projects Showcase
            </h2>
            <span className="text-xs font-mono text-cyan-400">{portfolio.projects.length} PROJECTS LOADED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.projects.map((proj) => (
              <div key={proj.id} className="p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-xl flex flex-col justify-between group">
                <div>
                  {proj.imageUrl && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 border border-slate-800 group-hover:scale-[1.02] transition-transform">
                      <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1.5">{proj.title}</h3>
                  <p className="text-xs font-mono text-cyan-400 mb-3">{proj.tagline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-5">{proj.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-lg text-[10px] font-mono font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
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
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
                        <ExternalLink className="w-3.5 h-3.5" /> Launch Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Technical Stack Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6"
        >
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
            <Code2 className="w-4 h-4" /> {"// TECHNICAL MASTERY MATRIX"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolio.skills.map((skill) => (
              <div key={skill.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-200">{skill.name}</span>
                  <span className="text-cyan-400 font-mono">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications & Wallet Badges */}
        {portfolio.certifications && portfolio.certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4"
          >
            <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> {"// CERTIFICATIONS & WALLET BADGES"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.certifications.map((cert) => (
                <div key={cert.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-white">{cert.title}</h3>
                    <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400">{cert.issuer} • {cert.issueDate}</p>
                  {cert.isWalletVerified && (
                    <div className="pt-1.5 flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded-full border border-cyan-500/30 inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-cyan-400" /> Career Wallet Verified
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Academic Foundation & Experience */}
        {(portfolio.education?.length > 0 || portfolio.experiences?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.education && portfolio.education.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4"
              >
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> {"// ACADEMIC QUALIFICATIONS"}
                </h2>
                <div className="space-y-4">
                  {portfolio.education.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
                        <span className="text-cyan-400 font-mono text-[11px]">{edu.startYear} – {edu.endYear}</span>
                      </div>
                      <p className="text-xs text-slate-400">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {portfolio.experiences && portfolio.experiences.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4"
              >
                <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> {"// WORK EXPERIENCE"}
                </h2>
                <div className="space-y-4">
                  {portfolio.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-white">{exp.role}</h3>
                        <span className="text-cyan-400 font-mono text-[11px]">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <p className="text-xs text-slate-300">{exp.company} • {exp.location}</p>
                      <p className="text-xs text-slate-400 leading-relaxed pt-1">{exp.description}</p>
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
