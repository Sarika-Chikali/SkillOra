'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPortfolio } from '@/lib/types/portfolio';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Briefcase, GraduationCap, Award, ShieldCheck, Building2, CheckCircle2, User } from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24 font-sans">
      
      {/* Top Corporate Executive Header */}
      <header className="bg-[#0F172A] text-white pt-10 pb-16 border-b-4 border-blue-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {portfolio.avatarUrl ? (
                <img
                  src={portfolio.avatarUrl}
                  alt={portfolio.fullName}
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-slate-700 shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400 shadow-xl">
                  <User className="w-12 h-12" />
                </div>
              )}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Executive Profile • Recruiter Ready
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  {portfolio.fullName}
                </h1>
                <p className="text-base font-semibold text-blue-400">
                  {portfolio.roleTitle}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" /> {portfolio.institutionOrCompany}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> {portfolio.contact.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-400" /> {portfolio.contact.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {portfolio.socialLinks.github && (
                <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.linkedin && (
                <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Recruiter 2-Column Structured Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Executive Summary */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-100 pb-2">
              Executive Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {portfolio.bio}
            </p>
          </div>

          {/* Technical Skills Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-100 pb-2">
              Core Competencies
            </h2>
            <div className="space-y-3">
              {portfolio.skills.map((skill) => (
                <div key={skill.id} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800">{skill.name}</span>
                    <span className="text-blue-700 font-bold text-[11px]">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Background */}
          {portfolio.education.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" /> Academic Qualifications
              </h2>
              {portfolio.education.map((edu) => (
                <div key={edu.id} className="text-xs space-y-1 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-slate-600">{edu.fieldOfStudy} • {edu.institution}</p>
                  <p className="text-[11px] font-semibold text-blue-600">{edu.startYear} — {edu.endYear}</p>
                </div>
              ))}
            </div>
          )}

          {/* Verified Career Wallet Badges */}
          {portfolio.certifications.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Career Wallet Badges
              </h2>
              {portfolio.certifications.map((cert) => (
                <div key={cert.id} className="text-xs space-y-1 pb-2.5 border-b border-slate-100 last:border-0 last:pb-0">
                  <p className="font-bold text-slate-900 flex items-center justify-between">
                    <span>{cert.title}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  </p>
                  <p className="text-slate-500 text-[11px]">{cert.issuer} ({cert.issueDate})</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Main Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Projects Showcase */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> Strategic Project Deliverables
            </h2>
            <div className="space-y-6">
              {portfolio.projects.map((proj) => (
                <div key={proj.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
                        Live Demo <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-blue-800">{proj.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-2.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded text-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience Timeline */}
          {portfolio.experiences && portfolio.experiences.length > 0 && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 border-b border-slate-100 pb-3">
                Professional Experience Timeline
              </h2>
              <div className="space-y-6">
                {portfolio.experiences.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-blue-600 pl-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{exp.company} • {exp.location}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
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
