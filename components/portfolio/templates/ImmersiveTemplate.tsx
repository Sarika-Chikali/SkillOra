'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPortfolio } from '@/lib/types/portfolio';
import { 
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, 
  Sparkles, Award, GraduationCap, Briefcase, Code2, ArrowUpRight, Camera, Film, User
} from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const ImmersiveTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#0C0F17] text-white pb-32 font-sans relative overflow-hidden">
      
      {/* Dynamic Visual Backdrop Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[550px] bg-gradient-to-b from-indigo-950/60 via-[#0C0F17]/90 to-[#0C0F17] pointer-events-none" />

      {/* Hero Full Storytelling Container */}
      <section className="relative pt-24 pb-20 max-w-6xl mx-auto px-6 sm:px-10 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-black uppercase tracking-widest text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" /> IMMERSIVE VISUAL STORYTELLING
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.98] max-w-4xl">
            {portfolio.fullName}
          </h1>

          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-300 max-w-3xl">
            {portfolio.roleTitle} <span className="text-slate-500 font-normal">—</span> {portfolio.institutionOrCompany}
          </p>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pt-4 border-t border-white/10">
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
              {portfolio.bio}
            </p>

            <div className="flex items-center gap-4 shrink-0">
              {portfolio.avatarUrl ? (
                <img
                  src={portfolio.avatarUrl}
                  alt={portfolio.fullName}
                  className="w-28 h-28 rounded-3xl object-cover ring-4 ring-indigo-500/40 shadow-2xl shadow-indigo-500/30"
                />
              ) : (
                <div className="w-28 h-28 rounded-3xl bg-slate-900 border border-white/20 flex items-center justify-center text-indigo-400/60 ring-4 ring-indigo-500/40 shadow-2xl shrink-0">
                  <User className="w-12 h-12" />
                </div>
              )}
              <div className="space-y-2">
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {portfolio.contact.location}
                </p>
                <a href={`mailto:${portfolio.contact.email}`} className="text-xs text-slate-300 hover:text-indigo-400 transition-colors block">
                  {portfolio.contact.email}
                </a>
                <div className="flex items-center gap-2 pt-1">
                  {portfolio.socialLinks?.github && (
                    <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-300 transition-colors">
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {portfolio.socialLinks?.linkedin && (
                    <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-300 transition-colors">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {portfolio.socialLinks?.twitter && (
                    <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-300 transition-colors">
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Storytelling Showcase */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 space-y-20 relative z-10">
        
        {/* Full-Bleed High-Impact Visual Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-12"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              <Film className="w-6 h-6 text-indigo-400" /> Visual Case Studies & Projects
            </h2>
            <span className="text-xs font-mono text-indigo-400">{portfolio.projects.length} CASE STUDIES</span>
          </div>

          <div className="space-y-16">
            {portfolio.projects.map((proj) => (
              <div key={proj.id} className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-b from-white/10 to-slate-900/90 border border-white/15 shadow-2xl space-y-6 group">
                {proj.imageUrl && (
                  <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-white/10 group-hover:scale-[1.01] transition-transform">
                    <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-3xl font-black text-white">{proj.title}</h3>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-2xl text-xs font-extrabold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/30 w-fit">
                        Launch Full Demo <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm font-bold text-indigo-300">{proj.tagline}</p>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">{proj.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="px-3.5 py-1 rounded-xl text-xs font-bold bg-white/10 text-slate-200 border border-white/15">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Competencies */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="p-8 sm:p-10 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6"
        >
          <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
            <Code2 className="w-4 h-4" /> Visual & Technical Stack
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolio.skills.map((skill) => (
              <div key={skill.id} className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>{skill.name}</span>
                  <span className="text-indigo-300 font-mono">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications & Wallet Badges */}
        {portfolio.certifications && portfolio.certifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="p-8 sm:p-10 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6"
          >
            <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> Certifications & Verified Badges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.certifications.map((cert) => (
                <div key={cert.id} className="p-5 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                  <h3 className="text-sm font-bold text-white">{cert.title}</h3>
                  <p className="text-xs text-indigo-300">{cert.issuer} • {cert.issueDate}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Education & Experience Grid */}
        {(portfolio.education?.length > 0 || portfolio.experiences?.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {portfolio.education && portfolio.education.length > 0 && (
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6">
                <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Academic Journey
                </h2>
                <div className="space-y-4">
                  {portfolio.education.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
                        <span className="text-indigo-300 font-mono">{edu.startYear} – {edu.endYear}</span>
                      </div>
                      <p className="text-xs text-slate-300">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {portfolio.experiences && portfolio.experiences.length > 0 && (
              <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6">
                <h2 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Work Experience
                </h2>
                <div className="space-y-4">
                  {portfolio.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-white">{exp.role}</h3>
                        <span className="text-indigo-300 font-mono">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <p className="text-xs text-slate-300">{exp.company} • {exp.location}</p>
                      <p className="text-xs text-slate-400 pt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

      </div>
    </div>
  );
};
