'use client';

import React from 'react';
import { UserPortfolio } from '@/lib/types/portfolio';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Sparkles, Award, GraduationCap, Briefcase, Code2, Heart, User } from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const ColorfulVibesTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-amber-50 via-rose-50 to-sky-50 text-slate-900 pb-20 font-sans">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Colorful Hero Header */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-amber-200/60 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
              <div className="relative">
                {portfolio.avatarUrl ? (
                  <img
                    src={portfolio.avatarUrl}
                    alt={portfolio.fullName}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-rose-400 p-1 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-amber-100 border-2 border-rose-300 flex items-center justify-center text-rose-400 ring-4 ring-rose-400 p-1 shadow-lg">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[10px]" title="Vibes">✨</span>
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-black uppercase tracking-wider">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Colorful Vibes
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {portfolio.fullName}
                </h1>
                <p className="text-base font-bold text-sky-600">
                  {portfolio.roleTitle}
                </p>
                <p className="text-xs text-slate-600 flex items-center justify-center sm:justify-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" /> {portfolio.contact.location} • {portfolio.institutionOrCompany}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {portfolio.socialLinks.github && (
                <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-slate-900 hover:bg-rose-600 text-white transition-all shadow-md hover:scale-110">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.linkedin && (
                <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-md hover:scale-110">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.twitter && (
                <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-sky-400 hover:bg-sky-500 text-white transition-all shadow-md hover:scale-110">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {portfolio.bio}
          </p>
        </div>

        {/* Colorful Skills Pills */}
        <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-sky-200/60 shadow-xl space-y-6">
          <h2 className="text-xs font-black uppercase tracking-wider text-sky-700 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-amber-500" /> Skills & Strengths
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.skills.map((skill, idx) => {
              const bgColors = ['bg-rose-50 border-rose-200 text-rose-900', 'bg-sky-50 border-sky-200 text-sky-900', 'bg-amber-50 border-amber-200 text-amber-900', 'bg-emerald-50 border-emerald-200 text-emerald-900', 'bg-purple-50 border-purple-200 text-purple-900'];
              const chosen = bgColors[idx % bgColors.length];
              return (
                <div key={skill.id} className={`p-4 rounded-2xl border ${chosen} shadow-xs space-y-2`}>
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{skill.name}</span>
                    <span>{skill.proficiency}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/80 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-rose-400 via-amber-400 to-sky-400 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projects Cards */}
        <div className="space-y-6">
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-rose-500" /> Awesome Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.projects.map((proj) => (
              <div key={proj.id} className="p-6 rounded-3xl bg-white/90 border border-slate-200/80 shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all">
                <div>
                  {proj.imageUrl && (
                    <div className="w-full h-44 rounded-2xl overflow-hidden mb-4 border border-slate-100">
                      <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{proj.title}</h3>
                  <p className="text-xs font-bold text-rose-600 mb-2">{proj.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{proj.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-2xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" /> Code
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-rose-500 to-amber-500 text-white flex items-center gap-1.5 shadow-md shadow-rose-500/20">
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Awards */}
        {portfolio.certifications && portfolio.certifications.length > 0 && (
          <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-amber-200/60 shadow-xl space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-500" /> Certifications & Verified Badges
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolio.certifications.map((cert) => (
                <div key={cert.id} className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                  <h3 className="text-xs font-bold text-slate-900">{cert.title}</h3>
                  <p className="text-[11px] font-medium text-amber-700">{cert.issuer} • {cert.issueDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education & Experience */}
        {(portfolio.education?.length > 0 || portfolio.experiences?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.education && portfolio.education.length > 0 && (
              <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-rose-200/60 shadow-xl space-y-6">
                <h2 className="text-xs font-black uppercase tracking-wider text-rose-700 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-rose-500" /> Education & Degrees
                </h2>
                <div className="space-y-4">
                  {portfolio.education.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                        <span className="text-rose-700 font-bold">{edu.startYear} – {edu.endYear}</span>
                      </div>
                      <p className="text-xs text-slate-600">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {portfolio.experiences && portfolio.experiences.length > 0 && (
              <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-sky-200/60 shadow-xl space-y-6">
                <h2 className="text-xs font-black uppercase tracking-wider text-sky-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-sky-500" /> Work Experience
                </h2>
                <div className="space-y-4">
                  {portfolio.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/80 space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <h3 className="font-bold text-slate-900">{exp.role}</h3>
                        <span className="text-sky-700 font-bold">{exp.startDate} – {exp.endDate}</span>
                      </div>
                      <p className="text-xs text-slate-600">{exp.company} • {exp.location}</p>
                      <p className="text-xs text-slate-500 pt-1">{exp.description}</p>
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
