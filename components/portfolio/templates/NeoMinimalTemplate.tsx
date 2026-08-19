'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPortfolio } from '@/lib/types/portfolio';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const NeoMinimalTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-slate-900 pb-28 font-sans leading-relaxed">
      
      {/* Fine Swiss Top Hairline */}
      <div className="w-full h-1 bg-slate-950" />

      <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-16 space-y-16">
        
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="border-b border-slate-200/80 pb-12 space-y-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-400 font-bold">
                SWISS NEO-MINIMAL ARCHITECTURE • {portfolio.status}
              </span>
              <h1 className="text-4xl sm:text-6xl font-light tracking-tight text-slate-950 leading-[1.08]">
                {portfolio.fullName}
              </h1>
              <p className="text-base font-normal text-slate-600 tracking-wide">
                {portfolio.roleTitle} <span className="text-slate-300">/</span> {portfolio.institutionOrCompany}
              </p>
            </div>

            <div className="shrink-0 space-y-3 text-right">
              {portfolio.avatarUrl ? (
                <img
                  src={portfolio.avatarUrl}
                  alt={portfolio.fullName}
                  className="w-24 h-24 rounded-none object-cover border border-slate-300 ml-auto"
                />
              ) : (
                <div className="w-24 h-24 border border-slate-300 bg-white flex items-center justify-center text-slate-400 ml-auto">
                  <span className="font-mono text-xl font-bold text-slate-800">{portfolio.fullName.charAt(0)}</span>
                </div>
              )}
              <div className="flex items-center justify-end gap-3 text-slate-700">
                {portfolio.socialLinks.github && (
                  <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-slate-950 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {portfolio.socialLinks.linkedin && (
                  <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-slate-950 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-500">
            <div>
              <span className="font-bold text-slate-900 block uppercase tracking-widest text-[10px] mb-0.5">Location</span>
              {portfolio.contact.location}
            </div>
            <div>
              <span className="font-bold text-slate-900 block uppercase tracking-widest text-[10px] mb-0.5">Direct Email</span>
              <a href={`mailto:${portfolio.contact.email}`} className="hover:underline">{portfolio.contact.email}</a>
            </div>
            <div>
              <span className="font-bold text-slate-900 block uppercase tracking-widest text-[10px] mb-0.5">Status</span>
              <span className="capitalize">{portfolio.status}</span>
            </div>
          </div>
        </motion.div>

        {/* Abstract Bio */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-3"
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-slate-400">
            01 / PERSPECTIVE
          </span>
          <p className="text-base sm:text-lg text-slate-800 leading-relaxed font-light max-w-3xl">
            {portfolio.bio}
          </p>
        </motion.div>

        {/* Technical Discipline Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-slate-400">
            02 / DISCIPLINE & MASTERY
          </span>
          <div className="divide-y divide-slate-200/80 border-t border-b border-slate-200/80">
            {portfolio.skills.map((skill) => (
              <div key={skill.id} className="py-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">{skill.name}</span>
                <span className="text-slate-500 font-mono text-[11px]">{skill.proficiency}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Selected Works */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-slate-400">
            03 / SELECTED WORKS
          </span>
          <div className="space-y-8">
            {portfolio.projects.map((proj, idx) => (
              <article key={proj.id} className="p-6 bg-white border border-slate-200/80 space-y-4 hover:border-slate-400 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-lg font-normal text-slate-950">{proj.title}</h3>
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-900 hover:underline flex items-center gap-1">
                      View Demo <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{proj.tagline}</p>
                <p className="text-xs text-slate-700 leading-relaxed font-light">{proj.description}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 text-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </motion.div>

        {/* Work Experience */}
        {portfolio.experiences && portfolio.experiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="space-y-4"
          >
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-slate-400">
              04 / WORK EXPERIENCE
            </span>
            <div className="divide-y divide-slate-200/80 border-t border-b border-slate-200/80">
              {portfolio.experiences.map((exp) => (
                <div key={exp.id} className="py-4 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-900">{exp.role} — {exp.company}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-xs text-slate-600 font-light leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolio.education && portfolio.education.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-slate-400">
                05 / EDUCATION
              </span>
              <div className="divide-y divide-slate-200/80 border-t border-b border-slate-200/80">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="py-3.5 space-y-1">
                    <p className="text-xs font-semibold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{edu.institution} ({edu.startYear} – {edu.endYear})</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {portfolio.certifications && portfolio.certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-slate-400">
                06 / CERTIFICATIONS
              </span>
              <div className="divide-y divide-slate-200/80 border-t border-b border-slate-200/80">
                {portfolio.certifications.map((cert) => (
                  <div key={cert.id} className="py-3.5 space-y-1">
                    <p className="text-xs font-semibold text-slate-900">{cert.title}</p>
                    <p className="text-[11px] text-slate-500 font-mono">{cert.issuer} • {cert.issueDate}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};
