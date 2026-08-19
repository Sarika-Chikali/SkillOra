'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserPortfolio } from '@/lib/types/portfolio';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Sparkles, Award, GraduationCap, Briefcase, Code2, ShieldCheck, Heart, Wand2, User } from 'lucide-react';

interface TemplateProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const CreativeAuroraTemplate: React.FC<TemplateProps> = ({ portfolio }) => {
  return (
    <div className="min-h-screen bg-[#0A0612] text-white pb-24 font-sans relative overflow-hidden">
      
      {/* Aurora Ambient Mesh Backgrounds */}
      <div className="absolute top-0 left-10 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/30 to-pink-600/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-600/20 to-rose-600/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 relative z-10 space-y-12">
        
        {/* Asymmetric Aurora Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-br from-white/10 via-purple-950/40 to-slate-900/90 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-8"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-pink-500/30 text-xs font-extrabold uppercase tracking-wider text-pink-300">
                <Wand2 className="w-3.5 h-3.5" /> Creative Aurora Architecture
              </div>
              <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-300 bg-clip-text text-transparent leading-tight tracking-tight">
                {portfolio.fullName}
              </h1>
              <p className="text-xl font-semibold text-pink-300">
                {portfolio.roleTitle}
              </p>
              <p className="text-xs text-purple-200/80 flex items-center gap-2 font-medium">
                <MapPin className="w-4 h-4 text-pink-400" /> {portfolio.contact.location} • {portfolio.institutionOrCompany}
              </p>
            </div>

            <div className="relative shrink-0">
              {portfolio.avatarUrl ? (
                <img
                  src={portfolio.avatarUrl}
                  alt={portfolio.fullName}
                  className="w-36 h-36 rounded-3xl object-cover ring-4 ring-pink-500/50 shadow-2xl shadow-pink-500/30 transform lg:rotate-3 hover:rotate-0 transition-transform"
                />
              ) : (
                <div className="w-36 h-36 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center text-pink-300 ring-4 ring-pink-500/50 shadow-2xl shadow-pink-500/30 transform lg:rotate-3 hover:rotate-0 transition-transform">
                  <User className="w-16 h-16" />
                </div>
              )}
              <span className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-pink-500 text-white font-extrabold text-[10px] shadow-lg">
                ✨ CREATIVE
              </span>
            </div>
          </div>

          <p className="text-base text-purple-100/90 leading-relaxed font-light border-t border-white/10 pt-6">
            {portfolio.bio}
          </p>

          <div className="flex items-center gap-3 pt-2">
            {portfolio.socialLinks.github && (
              <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-110">
                <Github className="w-5 h-5" />
              </a>
            )}
            {portfolio.socialLinks.linkedin && (
              <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {portfolio.socialLinks.twitter && (
              <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Skills - Aurora Floating Glass Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="p-8 sm:p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 space-y-6"
        >
          <h2 className="text-xs font-black uppercase tracking-widest text-pink-400 flex items-center gap-2">
            <Code2 className="w-4 h-4" /> Technical & Creative Skillset
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolio.skills.map((skill) => (
              <div key={skill.id} className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:border-pink-500/50 transition-all space-y-2 group">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-white group-hover:text-pink-300 transition-colors">{skill.name}</span>
                  <span className="text-pink-300 font-mono">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-400 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Asymmetric Staggered Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-pink-400" /> Featured Creative Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.projects.map((proj, idx) => (
              <div
                key={proj.id}
                className={`p-7 rounded-[2rem] bg-gradient-to-b from-white/10 to-slate-900/90 backdrop-blur-xl border border-white/15 hover:border-pink-500/50 transition-all flex flex-col justify-between ${
                  idx % 2 === 1 ? 'md:translate-y-6' : ''
                }`}
              >
                <div>
                  {proj.imageUrl && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-5 border border-white/10">
                      <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1.5">{proj.title}</h3>
                  <p className="text-xs font-bold text-pink-300 mb-3">{proj.tagline}</p>
                  <p className="text-xs text-purple-100/80 leading-relaxed mb-5 font-light">{proj.description}</p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-xl text-[10px] font-black bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-pink-500/30 text-pink-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5">
                        <Github className="w-3.5 h-3.5" /> Source
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center gap-1.5 shadow-lg shadow-pink-500/30">
                        <ExternalLink className="w-3.5 h-3.5" /> Launch Demo
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
          <div className="p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 space-y-4">
            <h2 className="text-xs font-black uppercase tracking-widest text-pink-400 flex items-center gap-2">
              <Award className="w-4 h-4" /> Awards & Career Wallet Verification
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
              <div className="p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-pink-400 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-400" /> Academic Degrees
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
              <div className="p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 space-y-4">
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
