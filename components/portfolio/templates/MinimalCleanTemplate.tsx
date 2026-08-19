'use client';

import React from 'react';
import { UserPortfolio } from '@/lib/types/portfolio';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, ShieldCheck, User } from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const MinimalCleanTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-20 font-sans">
      
      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12">
        
        {/* Minimal Hero Header */}
        <div className="border-b border-slate-200 pb-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {portfolio.avatarUrl ? (
                <img
                  src={portfolio.avatarUrl}
                  alt={portfolio.fullName}
                  className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                  <User className="w-10 h-10" />
                </div>
              )}
              <div className="space-y-1">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {portfolio.fullName}
                </h1>
                <p className="text-base font-medium text-slate-600">
                  {portfolio.roleTitle}
                </p>
                <p className="text-xs text-slate-500">
                  {portfolio.institutionOrCompany} • {portfolio.contact.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {portfolio.socialLinks.github && (
                <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.linkedin && (
                <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.twitter && (
                <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed max-w-2xl font-light">
            {portfolio.bio}
          </p>
        </div>

        {/* Technical Skills - Minimal Pills */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Skills & Competencies
          </h2>
          <div className="flex flex-wrap gap-2">
            {portfolio.skills.map((skill) => (
              <span key={skill.id} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-800 shadow-xs flex items-center gap-2">
                <span>{skill.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">{skill.proficiency}%</span>
              </span>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Selected Projects
          </h2>
          <div className="space-y-6">
            {portfolio.projects.map((proj) => (
              <div key={proj.id} className="p-6 bg-white border border-slate-200 rounded-2xl space-y-3 hover:border-slate-400 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                  <div className="flex items-center gap-3">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium">
                        <Github className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-900 hover:underline flex items-center gap-1 font-bold">
                        Visit Demo <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500">{proj.tagline}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Experience */}
        {portfolio.experiences && portfolio.experiences.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Work Experience</h2>
            <div className="space-y-3">
              {portfolio.experiences.map((exp) => (
                <div key={exp.id} className="p-5 bg-white border border-slate-200 rounded-xl space-y-1 hover:border-slate-400 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-xs font-bold text-slate-900">{exp.role}</p>
                    <span className="text-[11px] text-slate-500 font-mono">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-600">{exp.company} • {exp.location}</p>
                  <p className="text-xs text-slate-600 pt-1 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications & Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {portfolio.certifications.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Certifications</h2>
              <div className="space-y-3">
                {portfolio.certifications.map((cert) => (
                  <div key={cert.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-slate-900">{cert.title}</p>
                    <p className="text-[11px] text-slate-500">{cert.issuer} • {cert.issueDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {portfolio.education.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Education</h2>
              <div className="space-y-3">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-[11px] text-slate-500">{edu.institution} ({edu.startYear} – {edu.endYear})</p>
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
