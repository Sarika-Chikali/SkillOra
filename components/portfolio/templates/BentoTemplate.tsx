'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPortfolio } from '@/lib/types/portfolio';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Sparkles, Award, GraduationCap, Briefcase, Code2, ShieldCheck, Cpu, User } from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const BentoTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#F4F4F6] text-slate-900 pb-24 font-sans">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8">
        
        {/* Bento System Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white tracking-wider">
              ASYMMETRIC BENTO GRID SYSTEM
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              Modular Visual Portfolio
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {portfolio.socialLinks.github && (
              <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
                <Github className="w-4 h-4" />
              </a>
            )}
            {portfolio.socialLinks.linkedin && (
              <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* 4-Column Bento Composition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          
          {/* BENTO TILE 1: Main Profile Hero Box (Span 2 cols) */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-600 text-white shadow-xl shadow-blue-500/10 flex flex-col justify-between space-y-6">
            <div className="flex items-start justify-between gap-4">
              {portfolio.avatarUrl ? (
                <img
                  src={portfolio.avatarUrl}
                  alt={portfolio.fullName}
                  className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white ring-4 ring-white/30 shadow-lg">
                  <User className="w-10 h-10" />
                </div>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-white/20 backdrop-blur-md text-white border border-white/30">
                {portfolio.status}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white">{portfolio.fullName}</h2>
              <p className="text-base font-bold text-sky-200">{portfolio.roleTitle}</p>
              <p className="text-xs text-white/80 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-300" /> {portfolio.contact.location} • {portfolio.institutionOrCompany}
              </p>
            </div>

            <p className="text-xs text-white/90 leading-relaxed font-normal pt-2 border-t border-white/20">
              {portfolio.bio}
            </p>
          </div>

          {/* BENTO TILE 2: Technical Skills Matrix Box (Span 2 cols) */}
          <div className="md:col-span-2 p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-5 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" /> Technical Skills Bento
              </h3>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                {portfolio.skills.length} Competencies
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {portfolio.skills.map((skill) => (
                <div key={skill.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-900">{skill.name}</span>
                    <span className="text-blue-600">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BENTO TILES 3 & 4: Featured Projects Showcase (Span 2 cols each) */}
          {portfolio.projects.map((proj, idx) => {
            const gradients = [
              'from-slate-900 to-indigo-950 text-white',
              'from-amber-500 via-rose-500 to-purple-600 text-white',
              'from-emerald-900 to-slate-900 text-white',
            ];
            const chosen = gradients[idx % gradients.length];

            return (
              <div key={proj.id} className={`md:col-span-2 p-7 rounded-3xl bg-gradient-to-br ${chosen} shadow-xl flex flex-col justify-between space-y-4`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-white">{proj.title}</h3>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs font-bold text-white/90 mb-2">{proj.tagline}</p>
                  <p className="text-xs text-white/80 leading-relaxed font-light mb-4">{proj.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-white/20 text-white border border-white/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* BENTO TILE: Work Experience (Span 2 cols) */}
          {portfolio.experiences && portfolio.experiences.length > 0 && (
            <div className="md:col-span-2 p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Briefcase className="w-4 h-4 text-indigo-600" /> Work Experience Tile
              </h3>
              <div className="space-y-3">
                {portfolio.experiences.map((exp) => (
                  <div key={exp.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="font-bold text-slate-900">{exp.role}</h4>
                      <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full text-[11px]">{exp.startDate} – {exp.endDate}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-600">{exp.company} • {exp.location}</p>
                    <p className="text-xs text-slate-500 pt-1 leading-snug">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BENTO TILE 5: Career Wallet Verified Badges (Span 2 cols) */}
          {portfolio.certifications.length > 0 && (
            <div className="md:col-span-2 p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Award className="w-4 h-4 text-amber-500" /> Career Wallet Verification Badges
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {portfolio.certifications.map((cert) => (
                  <div key={cert.id} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1">
                    <p className="text-xs font-bold text-slate-900">{cert.title}</p>
                    <p className="text-[11px] text-slate-600">{cert.issuer} • {cert.issueDate}</p>
                    <div className="pt-1 flex items-center gap-1">
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-600" /> Wallet Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* BENTO TILE 6: Education & Timeline (Span 2 cols) */}
          {portfolio.education.length > 0 && (
            <div className="md:col-span-2 p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xl space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <GraduationCap className="w-4 h-4 text-blue-600" /> Academic Qualifications Tile
              </h3>
              <div className="space-y-3">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <h4 className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</h4>
                      <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full">{edu.startYear} – {edu.endYear}</span>
                    </div>
                    <p className="text-xs text-slate-600">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </motion.div>

      </div>
    </div>
  );
};
