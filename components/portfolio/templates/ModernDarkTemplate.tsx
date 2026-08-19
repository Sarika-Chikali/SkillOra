'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPortfolio } from '@/lib/types/portfolio';
import { 
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, 
  Award, CheckCircle2, Sparkles, Briefcase, GraduationCap, Code2, Terminal, ShieldCheck, User 
} from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const ModernDarkTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 pb-20 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Futuristic Hero */}
      <div className="relative h-64 sm:h-80 w-full bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 overflow-hidden border-b border-cyan-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10 space-y-10">
        
        {/* Floating Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/60"
        >
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              <div className="relative shrink-0">
                {portfolio.avatarUrl ? (
                  <img
                    src={portfolio.avatarUrl}
                    alt={portfolio.fullName}
                    className="w-32 h-32 rounded-3xl object-cover ring-2 ring-cyan-400 shadow-xl shadow-cyan-500/30"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 ring-2 ring-cyan-400/50 shadow-xl">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-cyan-400 ring-4 ring-slate-900" title="Active Status" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {portfolio.fullName}
                  </h1>
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                    {portfolio.status}
                  </span>
                </div>

                <p className="text-sm font-semibold text-cyan-400 tracking-wide flex items-center justify-center sm:justify-start gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  {portfolio.roleTitle}
                </p>

                <p className="text-xs text-slate-400">
                  {portfolio.institutionOrCompany}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-1 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {portfolio.contact.location}
                  </span>
                  <a href={`mailto:${portfolio.contact.email}`} className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> {portfolio.contact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {portfolio.socialLinks.github && (
                <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 transition-all">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.linkedin && (
                <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.twitter && (
                <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-3"
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Executive Summary
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            {portfolio.bio}
          </p>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-6"
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Code2 className="w-4 h-4" /> Tech Stack & Mastery
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.skills.map((skill) => (
              <div key={skill.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
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

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" /> Featured Projects Showcase
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.projects.map((proj) => (
              <div key={proj.id} className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all rounded-3xl p-6 flex flex-col justify-between group">
                <div>
                  {proj.imageUrl && (
                    <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 border border-slate-800 group-hover:scale-[1.02] transition-transform">
                      <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white mb-1">{proj.title}</h3>
                  <p className="text-xs font-medium text-cyan-400 mb-2">{proj.tagline}</p>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{proj.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-500/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" /> Source Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md shadow-cyan-500/20">
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        {portfolio.certifications.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> Certifications & Wallet Badges
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
          </div>
        )}

        {/* Education & Experience */}
        {(portfolio.education?.length > 0 || portfolio.experiences?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.education && portfolio.education.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Academic Journey
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
              </div>
            )}

            {portfolio.experiences && portfolio.experiences.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" /> Professional Experience
                </h2>
                <div className="space-y-4">
                  {portfolio.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-white">{exp.role}</h3>
                        <span className="text-cyan-400 font-mono text-[11px]">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <p className="text-xs text-slate-300">{exp.company} • {exp.location}</p>
                      <p className="text-xs text-slate-400 pt-1 leading-relaxed">{exp.description}</p>
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
