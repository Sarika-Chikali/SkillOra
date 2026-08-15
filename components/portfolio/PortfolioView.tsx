'use client';

import React from 'react';
import Link from 'next/link';
import { UserPortfolio } from '@/lib/types/portfolio';
import { 
  Github, Linkedin, Twitter, Globe, Mail, Phone, MapPin, 
  ExternalLink, Award, CheckCircle2, Sparkles, Briefcase, 
  GraduationCap, Download, Share2, Edit3, Code2, ShieldCheck, Building2
} from 'lucide-react';

interface PortfolioViewProps {
  portfolio: UserPortfolio;
  onShareClick?: () => void;
  isEditable?: boolean;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ 
  portfolio, 
  onShareClick,
  isEditable = false 
}) => {
  const handlePrintPDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const statusBadgeColor = (status: UserPortfolio['status']) => {
    switch (status) {
      case 'student':
        return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'fresher':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'employee':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default:
        return 'bg-sky-50 text-sky-700 border-sky-200/80';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans">
      
      {/* Top Hero Banner */}
      <div className="relative h-48 sm:h-64 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-black/20" />
        <div className="absolute -bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        {portfolio.bannerUrl && (
          <img
            src={portfolio.bannerUrl}
            alt="Cover Banner"
            className="w-full h-full object-cover mix-blend-overlay opacity-40"
          />
        )}
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 space-y-8">
        
        {/* Profile Card Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
            
            {/* Avatar & Core Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              <div className="relative shrink-0">
                <img
                  src={portfolio.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                  alt={portfolio.fullName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-white shadow-xl shadow-blue-500/10"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white" title="Active on Skillora" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {portfolio.fullName}
                  </h1>
                  <span title="Verified Skillora Profile">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 fill-blue-100" />
                  </span>
                  
                  <span className={`px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${statusBadgeColor(portfolio.status)}`}>
                    {portfolio.status}
                  </span>
                </div>

                <p className="text-sm font-semibold text-blue-600">
                  {portfolio.roleTitle}
                </p>

                {/* College / Company */}
                <p className="text-xs font-medium text-slate-600 flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{portfolio.institutionOrCompany}</span>
                </p>

                {/* Location & Contact Pills */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {portfolio.contact.location}
                  </span>
                  <a href={`mailto:${portfolio.contact.email}`} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {portfolio.contact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Actions & Social Icons */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {portfolio.socialLinks.github && (
                <a
                  href={portfolio.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/80 transition-all shadow-xs"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.linkedin && (
                <a
                  href={portfolio.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/80 transition-all shadow-xs"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {portfolio.socialLinks.twitter && (
                <a
                  href={portfolio.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200/80 transition-all shadow-xs"
                  title="Twitter Profile"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}

              <button
                onClick={handlePrintPDF}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" /> PDF Resume
              </button>

              {isEditable && (
                <Link
                  href="/portfolio/edit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Professional Bio Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-card border border-slate-200/80 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> About & Summary
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {portfolio.bio}
          </p>
        </div>

        {/* Skills Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-card border border-slate-200/80 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Technical & Core Skills
            </h2>
            <span className="text-xs font-medium text-slate-500">{portfolio.skills.length} Skills Listed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {portfolio.skills.map((skill) => (
              <div key={skill.id} className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-900">{skill.name}</span>
                  <span className="text-[11px] font-semibold text-blue-600">{skill.proficiency}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-400 transition-all duration-700"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        {portfolio.education.length > 0 && (
          <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-card border border-slate-200/80 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Education & Qualifications
            </h2>
            <div className="space-y-4">
              {portfolio.education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 w-fit">
                      {edu.startYear} – {edu.endYear}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">{edu.institution}</p>
                  {edu.gradeOrCgpa && (
                    <p className="text-xs text-slate-500">
                      Grade/Score: <span className="font-semibold text-slate-800">{edu.gradeOrCgpa}</span>
                    </p>
                  )}
                  {edu.activities && (
                    <p className="text-xs text-slate-600 pt-1 italic">
                      {edu.activities}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Showcase Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Featured Projects
            </h2>
            <span className="text-xs text-slate-500">{portfolio.projects.length} Projects</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.projects.map((proj) => (
              <div
                key={proj.id}
                className="glass-card glass-card-hover rounded-3xl p-6 shadow-card border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  {proj.imageUrl && (
                    <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 border border-slate-100">
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                    {proj.featured && (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-blue-600 mb-2.5">{proj.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{proj.description}</p>

                  {/* Bullet Highlights */}
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {proj.highlights.map((h, i) => (
                        <li key={i} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" /> Repository
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Achievements Section */}
        {portfolio.certifications.length > 0 && (
          <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-card border border-slate-200/80 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
              <Award className="w-4 h-4" /> Certifications & Awards
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {portfolio.certifications.map((cert) => (
                <div key={cert.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{cert.title}</h3>
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  </div>
                  <p className="text-[11px] font-medium text-slate-600">{cert.issuer} • {cert.issueDate}</p>
                  {cert.description && (
                    <p className="text-[11px] text-slate-500 pt-1 leading-snug">{cert.description}</p>
                  )}
                  {cert.isWalletVerified && (
                    <div className="pt-1.5 flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/80 inline-flex items-center gap-1" title={cert.verificationTxHash ? `Wallet Hash: ${cert.verificationTxHash}` : 'Verified via Career Wallet'}>
                        <ShieldCheck className="w-3 h-3 text-blue-600" /> Career Wallet Verified
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience Section (If applicable) */}
        {portfolio.experiences && portfolio.experiences.length > 0 && (
          <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-card border border-slate-200/80 space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Professional Experience
            </h2>
            <div className="space-y-4">
              {portfolio.experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 w-fit">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">{exp.company} • {exp.location}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
