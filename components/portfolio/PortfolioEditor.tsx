'use client';

import React, { useState, useEffect } from 'react';
import { UserPortfolio, Project, Skill, CertificationAchievement, Education, WorkExperience } from '@/lib/types/portfolio';
import { PortfolioService } from '@/lib/services/portfolioService';
import { 
  User, Code2, GraduationCap, Briefcase, Award, Plus, Trash2, Check, ArrowLeft, Save, Sparkles, Building2
} from 'lucide-react';
import Link from 'next/link';

export const PortfolioEditor: React.FC = () => {
  const [portfolio, setPortfolio] = useState<UserPortfolio | null>(null);
  const [activeSection, setActiveSection] = useState<'info' | 'skills' | 'education' | 'projects' | 'certifications' | 'experience'>('info');
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // New Project State
  const [newProj, setNewProj] = useState<Partial<Project>>({
    title: '', tagline: '', description: '', techStack: [], githubUrl: '', liveUrl: '', featured: true
  });
  const [techInput, setTechInput] = useState('');

  // New Skill State
  const [newSkill, setNewSkill] = useState<{ name: string; category: Skill['category']; proficiency: number }>({
    name: '', category: 'Frontend', proficiency: 85
  });

  // New Edu State
  const [newEdu, setNewEdu] = useState<Partial<Education>>({
    degree: '', fieldOfStudy: '', institution: '', startYear: '', endYear: '', gradeOrCgpa: ''
  });

  // New Cert State
  const [newCert, setNewCert] = useState<Partial<CertificationAchievement>>({
    title: '', issuer: '', issueDate: '', type: 'certification', description: ''
  });

  // New Exp State
  const [newExp, setNewExp] = useState<Partial<WorkExperience>>({
    role: '', company: '', location: '', startDate: '', endDate: 'Present', description: ''
  });

  useEffect(() => {
    setPortfolio(PortfolioService.getPortfolio());
  }, []);

  if (!portfolio) return null;

  const notifySave = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 2500);
  };

  const handleUpdatePortfolio = (updated: UserPortfolio) => {
    setPortfolio(updated);
    PortfolioService.savePortfolio(updated);
    notifySave('Saved Changes');
  };

  // Add Project
  const handleAddProject = () => {
    if (!newProj.title || !newProj.description) return;
    const added = PortfolioService.addProject({
      title: newProj.title,
      tagline: newProj.tagline || 'Student & developer project',
      description: newProj.description,
      highlights: [],
      techStack: techInput ? techInput.split(',').map(s => s.trim()) : ['React', 'TypeScript'],
      githubUrl: newProj.githubUrl,
      liveUrl: newProj.liveUrl,
      featured: newProj.featured ?? true,
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    });
    setPortfolio(added);
    setNewProj({ title: '', tagline: '', description: '', techStack: [], githubUrl: '', liveUrl: '', featured: true });
    setTechInput('');
    notifySave('Project Added');
  };

  const handleDeleteProject = (id: string) => {
    const updated = PortfolioService.deleteProject(id);
    setPortfolio(updated);
    notifySave('Project Removed');
  };

  // Add Skill
  const handleAddSkill = () => {
    if (!newSkill.name) return;
    const added = PortfolioService.addSkill({
      name: newSkill.name,
      category: newSkill.category,
      proficiency: newSkill.proficiency,
      isVerified: true,
    });
    setPortfolio(added);
    setNewSkill({ name: '', category: 'Frontend', proficiency: 85 });
    notifySave('Skill Added');
  };

  const handleDeleteSkill = (id: string) => {
    const updated = PortfolioService.deleteSkill(id);
    setPortfolio(updated);
    notifySave('Skill Removed');
  };

  // Add Education
  const handleAddEducation = () => {
    if (!newEdu.degree || !newEdu.institution) return;
    const added = PortfolioService.addEducation({
      degree: newEdu.degree,
      fieldOfStudy: newEdu.fieldOfStudy || 'Computer Science',
      institution: newEdu.institution,
      startYear: newEdu.startYear || '2022',
      endYear: newEdu.endYear || '2026',
      gradeOrCgpa: newEdu.gradeOrCgpa,
    });
    setPortfolio(added);
    setNewEdu({ degree: '', fieldOfStudy: '', institution: '', startYear: '', endYear: '', gradeOrCgpa: '' });
    notifySave('Education Added');
  };

  const handleDeleteEducation = (id: string) => {
    const updated = PortfolioService.deleteEducation(id);
    setPortfolio(updated);
    notifySave('Education Removed');
  };

  // Add Certification
  const handleAddCertification = () => {
    if (!newCert.title || !newCert.issuer) return;
    const added = PortfolioService.addCertification({
      title: newCert.title,
      issuer: newCert.issuer,
      issueDate: newCert.issueDate || '2026',
      type: newCert.type || 'certification',
      description: newCert.description,
    });
    setPortfolio(added);
    setNewCert({ title: '', issuer: '', issueDate: '', type: 'certification', description: '' });
    notifySave('Certification Added');
  };

  const handleDeleteCertification = (id: string) => {
    const updated = PortfolioService.deleteCertification(id);
    setPortfolio(updated);
    notifySave('Certification Removed');
  };

  // Add Experience
  const handleAddExperience = () => {
    if (!newExp.role || !newExp.company) return;
    const added = PortfolioService.addExperience({
      role: newExp.role,
      company: newExp.company,
      location: newExp.location || 'India',
      startDate: newExp.startDate || 'May 2025',
      endDate: newExp.endDate || 'Present',
      isCurrentRole: false,
      description: newExp.description || '',
      keyAchievements: [],
    });
    setPortfolio(added);
    setNewExp({ role: '', company: '', location: '', startDate: '', endDate: 'Present', description: '' });
    notifySave('Experience Added');
  };

  const handleDeleteExperience = (id: string) => {
    const updated = PortfolioService.deleteExperience(id);
    setPortfolio(updated);
    notifySave('Experience Removed');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans">
      
      {/* Editor Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-16 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/portfolio" className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold text-slate-900">Edit Portfolio & Profile</h1>
              <p className="text-xs text-slate-500">Update your profile info, skills, education, and projects</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5" /> {saveToast}
              </span>
            )}
            <Link
              href="/portfolio/preview"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              View Public Preview
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-x-auto">
          {[
            { id: 'info', label: 'Basic Info', icon: User },
            { id: 'skills', label: 'Skills', icon: Code2 },
            { id: 'education', label: 'Education', icon: GraduationCap },
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'certifications', label: 'Certs & Awards', icon: Award },
            { id: 'experience', label: 'Experience', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  active
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* SECTION 1: Basic Info */}
        {activeSection === 'info' && (
          <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-5 border border-slate-200/80 shadow-card">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Personal Persona & Contact Info
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  type="text"
                  value={portfolio.fullName}
                  onChange={(e) => handleUpdatePortfolio({ ...portfolio, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs glass-input rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Professional Role / Title</label>
                <input
                  type="text"
                  value={portfolio.roleTitle}
                  onChange={(e) => handleUpdatePortfolio({ ...portfolio, roleTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs glass-input rounded-xl focus:outline-none"
                  placeholder="e.g. Full Stack Developer / Fresher"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Career Status</label>
                <select
                  value={portfolio.status}
                  onChange={(e) => handleUpdatePortfolio({ ...portfolio, status: e.target.value as UserPortfolio['status'] })}
                  className="w-full px-3.5 py-2 text-xs glass-input rounded-xl focus:outline-none bg-white"
                >
                  <option value="student">Student</option>
                  <option value="fresher">Fresher / Graduate</option>
                  <option value="employee">Employee</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">College or Company Name</label>
                <input
                  type="text"
                  value={portfolio.institutionOrCompany}
                  onChange={(e) => handleUpdatePortfolio({ ...portfolio, institutionOrCompany: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs glass-input rounded-xl focus:outline-none"
                  placeholder="e.g. NIT Warangal or Infosys"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Professional Bio & Summary</label>
              <textarea
                rows={4}
                value={portfolio.bio}
                onChange={(e) => handleUpdatePortfolio({ ...portfolio, bio: e.target.value })}
                className="w-full px-3.5 py-2 text-xs glass-input rounded-xl focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={portfolio.contact.email}
                  onChange={(e) => handleUpdatePortfolio({ ...portfolio, contact: { ...portfolio.contact, email: e.target.value } })}
                  className="w-full px-3.5 py-2 text-xs glass-input rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  value={portfolio.contact.phone || ''}
                  onChange={(e) => handleUpdatePortfolio({ ...portfolio, contact: { ...portfolio.contact, phone: e.target.value } })}
                  className="w-full px-3.5 py-2 text-xs glass-input rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">City / Location</label>
                <input
                  type="text"
                  value={portfolio.contact.location}
                  onChange={(e) => handleUpdatePortfolio({ ...portfolio, contact: { ...portfolio.contact, location: e.target.value } })}
                  className="w-full px-3.5 py-2 text-xs glass-input rounded-xl"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">GitHub Link</label>
                <input
                  type="text"
                  value={portfolio.socialLinks.github || ''}
                  onChange={(e) => handleUpdatePortfolio({ ...portfolio, socialLinks: { ...portfolio.socialLinks, github: e.target.value } })}
                  className="w-full px-3.5 py-2 text-xs glass-input rounded-xl"
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">LinkedIn Link</label>
                <input
                  type="text"
                  value={portfolio.socialLinks.linkedin || ''}
                  onChange={(e) => handleUpdatePortfolio({ ...portfolio, socialLinks: { ...portfolio.socialLinks, linkedin: e.target.value } })}
                  className="w-full px-3.5 py-2 text-xs glass-input rounded-xl"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Personal Website</label>
                <input
                  type="text"
                  value={portfolio.socialLinks.website || ''}
                  onChange={(e) => handleUpdatePortfolio({ ...portfolio, socialLinks: { ...portfolio.socialLinks, website: e.target.value } })}
                  className="w-full px-3.5 py-2 text-xs glass-input rounded-xl"
                  placeholder="https://..."
                />
              </div>
            </div>

          </div>
        )}

        {/* SECTION 2: Skills */}
        {activeSection === 'skills' && (
          <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-5 border border-slate-200/80 shadow-card">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-600" /> Skill Proficiency Manager
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <input
                type="text"
                placeholder="Skill Name (e.g. React.js)"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="px-3 py-2 text-xs glass-input rounded-xl"
              />
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as Skill['category'] })}
                className="px-3 py-2 text-xs glass-input rounded-xl bg-white"
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Database">Database</option>
                <option value="Mobile">Mobile</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={newSkill.proficiency}
                  onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                  className="w-full accent-blue-600"
                />
                <span className="text-xs font-bold text-blue-600 w-8">{newSkill.proficiency}%</span>
              </div>
              <button
                onClick={handleAddSkill}
                className="py-2 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {portfolio.skills.map((s) => (
                <div key={s.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">{s.name}</span>
                    <span className="text-[11px] text-slate-500 block">{s.category} • {s.proficiency}%</span>
                  </div>
                  <button
                    onClick={() => handleDeleteSkill(s.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SECTION 3: Education */}
        {activeSection === 'education' && (
          <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-5 border border-slate-200/80 shadow-card">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Education & Qualifications
            </h2>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Degree (e.g. B.Tech / B.Sc)"
                  value={newEdu.degree}
                  onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Field of Study (e.g. Computer Science)"
                  value={newEdu.fieldOfStudy}
                  onChange={(e) => setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
              </div>

              <input
                type="text"
                placeholder="Institution Name (e.g. NIT Warangal)"
                value={newEdu.institution}
                onChange={(e) => setNewEdu({ ...newEdu, institution: e.target.value })}
                className="w-full px-3 py-2 text-xs glass-input rounded-xl"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Start Year (2022)"
                  value={newEdu.startYear}
                  onChange={(e) => setNewEdu({ ...newEdu, startYear: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
                <input
                  type="text"
                  placeholder="End Year (2026 / Present)"
                  value={newEdu.endYear}
                  onChange={(e) => setNewEdu({ ...newEdu, endYear: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
                <input
                  type="text"
                  placeholder="CGPA / Grade (e.g. 8.9 CGPA)"
                  value={newEdu.gradeOrCgpa}
                  onChange={(e) => setNewEdu({ ...newEdu, gradeOrCgpa: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
              </div>

              <button
                onClick={handleAddEducation}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Education
              </button>
            </div>

            <div className="space-y-3">
              {portfolio.education.map((edu) => (
                <div key={edu.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</h3>
                    <p className="text-[11px] text-slate-600">{edu.institution} • {edu.startYear} - {edu.endYear}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteEducation(edu.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SECTION 4: Projects */}
        {activeSection === 'projects' && (
          <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-5 border border-slate-200/80 shadow-card">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Projects Showcase
            </h2>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Project Title (e.g. Skillora Platform)"
                  value={newProj.title}
                  onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Tagline / Short Subtitle"
                  value={newProj.tagline}
                  onChange={(e) => setNewProj({ ...newProj, tagline: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
              </div>

              <textarea
                rows={3}
                placeholder="Detailed project description..."
                value={newProj.description}
                onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                className="w-full px-3 py-2 text-xs glass-input rounded-xl"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Tech Stack (comma separated: React, Node)"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
                <input
                  type="text"
                  placeholder="GitHub URL"
                  value={newProj.githubUrl}
                  onChange={(e) => setNewProj({ ...newProj, githubUrl: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Live Demo URL"
                  value={newProj.liveUrl}
                  onChange={(e) => setNewProj({ ...newProj, liveUrl: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
              </div>

              <button
                onClick={handleAddProject}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {portfolio.projects.map((proj) => (
                <div key={proj.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{proj.title}</h3>
                    <p className="text-[11px] text-slate-600">{proj.tagline}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SECTION 5: Certifications */}
        {activeSection === 'certifications' && (
          <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-5 border border-slate-200/80 shadow-card">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" /> Certifications & Awards
            </h2>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <input
                type="text"
                placeholder="Title (e.g. AWS Certified Practitioner)"
                value={newCert.title}
                onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                className="w-full px-3 py-2 text-xs glass-input rounded-xl"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Issuer (e.g. AWS / Meta)"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Issue Date (Nov 2025)"
                  value={newCert.issueDate}
                  onChange={(e) => setNewCert({ ...newCert, issueDate: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
              </div>

              <button
                onClick={handleAddCertification}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certification
              </button>
            </div>

            <div className="space-y-3">
              {portfolio.certifications.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{c.title}</h3>
                    <p className="text-[11px] text-slate-600">{c.issuer} • {c.issueDate}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteCertification(c.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* SECTION 6: Work Experience */}
        {activeSection === 'experience' && (
          <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-5 border border-slate-200/80 shadow-card">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> Work Experience & Internships
            </h2>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Role (e.g. Frontend Intern)"
                  value={newExp.role}
                  onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={newExp.company}
                  onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Location (e.g. Bengaluru)"
                  value={newExp.location}
                  onChange={(e) => setNewExp({ ...newExp, location: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Start Date (May 2025)"
                  value={newExp.startDate}
                  onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
                <input
                  type="text"
                  placeholder="End Date (Aug 2025 / Present)"
                  value={newExp.endDate}
                  onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                  className="px-3 py-2 text-xs glass-input rounded-xl"
                />
              </div>

              <button
                onClick={handleAddExperience}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>

            <div className="space-y-3">
              {portfolio.experiences && portfolio.experiences.map((exp) => (
                <div key={exp.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                    <p className="text-[11px] text-slate-600">{exp.company} • {exp.startDate} - {exp.endDate}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteExperience(exp.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
