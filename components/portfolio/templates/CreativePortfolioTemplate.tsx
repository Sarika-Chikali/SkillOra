'use client';

import React from 'react';
import { UserPortfolio } from '@/lib/types/portfolio';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Sparkles, Award, GraduationCap, Briefcase, Code2, ShieldCheck, User } from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const CreativePortfolioTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white pb-20 font-sans">
      
      {/* Dynamic Floating Gradient Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-80 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10 space-y-10">
        
        {/* Creative Hero Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              {portfolio.avatarUrl ? (
                <img
                  src={portfolio.avatarUrl}
                  alt={portfolio.fullName}
                  className="w-32 h-32 rounded-3xl object-cover ring-4 ring-pink-500/50 shadow-xl shadow-pink-500/20"
                />
              ) : (
                <div className="w-32 h-32 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-pink-300 ring-4 ring-pink-500/50 shadow-xl">
                  <User className="w-12 h-12" />
                </div>
              )}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Creative Portfolio
                </div>
                <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent">
                  {portfolio.fullName}
                </h1>
                <p className="text-base font-semibold text-pink-300">
                  {portfolio.roleTitle}
                </p>
                <p className="text-xs text-purple-200/80 flex items-center justify-center sm:justify-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-pink-400" /> {portfolio.contact.location} • {portfolio.institutionOrCompany}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {portfolio.socialLinks.github && (
                <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-110">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {portfolio.socialLinks.linkedin && (
                <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-110">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {portfolio.socialLinks.twitter && (
                <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-110">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-purple-100/90 leading-relaxed font-normal">
            {portfolio.bio}
          </p>
        </div>

        {/* Skills - Creative Glass Pills */}
        <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 space-y-6">
          <h2 className="text-xs font-black uppercase tracking-widest text-pink-400 flex items-center gap-2">
            <Code2 className="w-4 h-4" /> Creative Tech & Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.skills.map((skill) => (
              <div key={skill.id} className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:border-pink-500/50 transition-all space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>{skill.name}</span>
                  <span className="text-pink-300">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects showcase */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-pink-400" /> Highlight Showcase
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.projects.map((proj) => (
              <div key={proj.id} className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-pink-500/50 transition-all flex flex-col justify-between">
                <div>
                  {proj.imageUrl && (
                    <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 border border-white/10">
                      <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-white mb-1">{proj.title}</h3>
                  <p className="text-xs font-semibold text-pink-300 mb-2">{proj.tagline}</p>
                  <p className="text-xs text-purple-100/80 leading-relaxed mb-4">{proj.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-pink-500/30 text-pink-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" /> Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center gap-1.5 shadow-lg shadow-pink-500/25">
                        <ExternalLink className="w-3.5 h-3.5" /> Launch Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Awards */}
        {portfolio.certifications.length > 0 && (
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-pink-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> Awards & Recognitions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.certifications.map((cert) => (
                <div key={cert.id} className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs font-bold text-white">{cert.title}</h3>
                    <Award className="w-4 h-4 text-pink-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-purple-200">{cert.issuer} • {cert.issueDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Experience */}
        {(portfolio.education?.length > 0 || portfolio.experiences?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.education && portfolio.education.length > 0 && (
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-pink-400 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-400" /> Academic Qualifications
                </h2>
                <div className="space-y-4">
                  {portfolio.education.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-white">{edu.degree} in {edu.fieldOfStudy}</h3>
                        <span className="text-pink-300 font-mono text-[11px]">{edu.startYear} – {edu.endYear}</span>
                      </div>
                      <p className="text-xs text-purple-200">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {portfolio.experiences && portfolio.experiences.length > 0 && (
              <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-pink-400 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-pink-400" /> Work Experience
                </h2>
                <div className="space-y-4">
                  {portfolio.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-white">{exp.role}</h3>
                        <span className="text-pink-300 font-mono text-[11px]">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <p className="text-xs text-purple-200">{exp.company} • {exp.location}</p>
                      <p className="text-xs text-slate-300 pt-1 leading-relaxed">{exp.description}</p>
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
