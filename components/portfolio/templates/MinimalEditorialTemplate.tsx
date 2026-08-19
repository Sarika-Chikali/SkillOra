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

export const MinimalEditorialTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 pb-28 font-serif leading-relaxed">
      
      {/* Editorial Top Line */}
      <div className="w-full h-1.5 bg-slate-900" />

      <div className="max-w-4xl mx-auto px-6 sm:px-10 pt-16 space-y-16">
        
        {/* Magazine Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b border-slate-900/80 pb-12 space-y-8"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-sans font-bold uppercase tracking-[0.25em] text-slate-500">
                Portfolio Volume • {portfolio.status.toUpperCase()}
              </span>
              <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-slate-950 font-serif leading-[1.1]">
                {portfolio.fullName}
              </h1>
              <p className="text-lg font-sans font-light text-slate-700 tracking-wide pt-1">
                {portfolio.roleTitle} <span className="text-slate-400">—</span> {portfolio.institutionOrCompany}
              </p>
            </div>

            <div className="shrink-0 space-y-3 text-right sm:text-right">
              {portfolio.avatarUrl ? (
                <img
                  src={portfolio.avatarUrl}
                  alt={portfolio.fullName}
                  className="w-28 h-28 rounded-none object-cover border border-slate-900 shadow-md ml-auto"
                />
              ) : (
                <div className="w-28 h-28 border border-slate-900 bg-slate-100 flex items-center justify-center text-slate-700 font-serif text-2xl font-bold ml-auto shadow-md">
                  {portfolio.fullName.charAt(0)}
                </div>
              )}
              <div className="flex items-center justify-end gap-3 text-slate-800 font-sans">
                {portfolio.socialLinks.github && (
                  <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-slate-500 transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {portfolio.socialLinks.linkedin && (
                  <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-slate-500 transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {portfolio.socialLinks.twitter && (
                  <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-slate-500 transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-900 block uppercase tracking-wider mb-0.5">Location</span>
              {portfolio.contact.location}
            </div>
            <div>
              <span className="font-bold text-slate-900 block uppercase tracking-wider mb-0.5">Contact Email</span>
              <a href={`mailto:${portfolio.contact.email}`} className="hover:underline">{portfolio.contact.email}</a>
            </div>
            <div>
              <span className="font-bold text-slate-900 block uppercase tracking-wider mb-0.5">Status</span>
              <span className="capitalize">{portfolio.status}</span>
            </div>
          </div>
        </motion.div>

        {/* Editorial Biography */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xs font-sans font-extrabold uppercase tracking-[0.2em] text-slate-400">
            01 / Biography & Perspective
          </h2>
          <p className="text-lg sm:text-xl font-serif text-slate-800 leading-relaxed font-light italic border-l-2 border-slate-900 pl-6">
            &ldquo;{portfolio.bio}&rdquo;
          </p>
        </motion.div>

        {/* Skills Section - Minimal Horizontal Rows */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-xs font-sans font-extrabold uppercase tracking-[0.2em] text-slate-400">
            02 / Core Skills & Technical Discipline
          </h2>
          <div className="divide-y divide-slate-200 border-t border-b border-slate-200 font-sans">
            {portfolio.skills.map((skill) => (
              <div key={skill.id} className="py-3 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 text-sm font-serif">{skill.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500 font-mono text-[11px]">{skill.proficiency}% Proficiency</span>
                  <div className="w-24 h-1 bg-slate-200 overflow-hidden">
                    <div className="h-full bg-slate-900" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Editorial Projects Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-8"
        >
          <h2 className="text-xs font-sans font-extrabold uppercase tracking-[0.2em] text-slate-400">
            03 / Selected Works & Endeavors
          </h2>
          <div className="space-y-12">
            {portfolio.projects.map((proj, idx) => (
              <article key={proj.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-b border-slate-200 pb-10">
                <div className="md:col-span-1 font-mono text-xs text-slate-400 font-bold">
                  0{idx + 1}
                </div>
                <div className="md:col-span-11 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-2xl font-serif text-slate-950 font-normal">{proj.title}</h3>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="font-sans text-xs font-bold text-slate-900 hover:underline flex items-center gap-1">
                        View Live Site <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs font-sans font-semibold text-slate-600 uppercase tracking-wider">{proj.tagline}</p>
                  <p className="text-sm font-serif text-slate-700 leading-relaxed font-light">{proj.description}</p>

                  <div className="flex flex-wrap gap-2 pt-2 font-sans">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.div>

        {/* Work Experience */}
        {portfolio.experiences && portfolio.experiences.length > 0 && (
          <div className="space-y-6 pt-4">
            <h2 className="text-xs font-sans font-extrabold uppercase tracking-[0.2em] text-slate-400">
              04 / Work Experience
            </h2>
            <div className="space-y-6 font-sans">
              {portfolio.experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-slate-900 pl-4 py-1 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <h3 className="font-bold text-slate-950 text-sm font-serif">{exp.role}</h3>
                    <span className="text-slate-500 font-mono">{exp.startDate} — {exp.endDate}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-700">{exp.company} • {exp.location}</p>
                  <p className="text-xs text-slate-600 pt-1 font-serif">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {portfolio.education.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xs font-sans font-extrabold uppercase tracking-[0.2em] text-slate-400">
                05 / Academic Foundation
              </h2>
              <div className="space-y-6 font-sans">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="border-l-2 border-slate-900 pl-4 py-1 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <h3 className="font-bold text-slate-950 text-sm font-serif">{edu.degree} in {edu.fieldOfStudy}</h3>
                      <span className="text-slate-500 font-mono">{edu.startYear} — {edu.endYear}</span>
                    </div>
                    <p className="text-xs text-slate-700">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {portfolio.certifications && portfolio.certifications.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xs font-sans font-extrabold uppercase tracking-[0.2em] text-slate-400">
                06 / Certifications & Badges
              </h2>
              <div className="space-y-4 font-sans">
                {portfolio.certifications.map((cert) => (
                  <div key={cert.id} className="border-l-2 border-slate-400 pl-4 py-1 space-y-1">
                    <h3 className="font-bold text-slate-950 text-xs font-serif">{cert.title}</h3>
                    <p className="text-[11px] text-slate-500 font-mono">{cert.issuer} • {cert.issueDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
