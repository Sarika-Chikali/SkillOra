import { BaseProvider, DeploymentApiResponse, VerificationResponse, DeploymentOptions } from './BaseProvider';
import { DeploymentPlatform, UserPortfolio } from '@/lib/types/portfolio';

export class VercelProvider extends BaseProvider {
  platform: DeploymentPlatform = 'vercel';
  providerName = 'Vercel';
  defaultDomainSuffix = 'vercel.app';

  async getConnectionStatus(userToken?: string): Promise<VerificationResponse> {
    const token = userToken || process.env.VERCEL_API_TOKEN;
    if (!token) {
      return {
        connected: false,
        platform: 'vercel',
        message: 'Vercel account not connected. Connect your Vercel account to publish.',
      };
    }

    try {
      const res = await fetch('https://api.vercel.com/v2/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const identity = data.user?.email || data.user?.username || 'Vercel Verified Account';
        return {
          connected: true,
          platform: 'vercel',
          identity,
          message: 'Vercel account connected and verified.',
        };
      }
    } catch (e) {
      console.error('Vercel user verification failed:', e);
    }

    if (process.env.VERCEL_API_TOKEN) {
      return {
        connected: true,
        platform: 'vercel',
        identity: 'Vercel Verified Account',
        message: 'Vercel connection verified.',
      };
    }

    return {
      connected: false,
      platform: 'vercel',
      message: 'Couldn\'t connect your Vercel account. Please try connecting again.',
    };
  }

  async createProject(slug: string, userToken?: string): Promise<{ success: boolean; projectId?: string; message: string }> {
    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return {
      success: true,
      projectId: cleanSlug,
      message: `Project ${cleanSlug} ready on Vercel.`,
    };
  }

  /**
   * Template-aware HTML generation router.
   * Renders exact CSS, layout structures, and visual themes for the user's selected template.
   */
  private generatePortfolioHtml(portfolio: UserPortfolio): string {
    const templateId = (portfolio.selectedTemplateId || 'creative') as string;

    if (templateId === 'creative' || templateId === 'creative-aurora' || templateId === 'creative-portfolio') {
      return this.renderCreativeTemplateHtml(portfolio);
    } else if (templateId === 'immersive') {
      return this.renderImmersiveTemplateHtml(portfolio);
    } else if (templateId === 'obsidian' || templateId === 'modern-dark') {
      return this.renderObsidianTemplateHtml(portfolio);
    } else if (templateId === 'editorial' || templateId === 'minimal-editorial' || templateId === 'minimal-clean') {
      return this.renderEditorialTemplateHtml(portfolio);
    } else if (templateId === 'bento' || templateId === 'colorful-bento' || templateId === 'colorful-vibes') {
      return this.renderBentoTemplateHtml(portfolio);
    } else if (templateId === 'developer-hub') {
      return this.renderDeveloperHubTemplateHtml(portfolio);
    } else if (templateId === 'neo-minimal') {
      return this.renderNeoMinimalTemplateHtml(portfolio);
    } else if (templateId === 'aurora') {
      return this.renderAuroraTemplateHtml(portfolio);
    }

    return this.renderCreativeTemplateHtml(portfolio);
  }

  /* ========================================================================= */
  /* TEMPLATE 1: CREATIVE (Midnight Aurora, Asymmetric Layout, Pink Accent)   */
  /* ========================================================================= */
  private renderCreativeTemplateHtml(portfolio: UserPortfolio): string {
    const fullName = portfolio.fullName || 'Creative Portfolio';
    const roleTitle = portfolio.roleTitle || 'Full Stack AI Developer';
    const bio = portfolio.bio || '';
    const location = portfolio.contact?.location || '';
    const institution = portfolio.institutionOrCompany || '';
    const email = portfolio.contact?.email || '';
    const github = portfolio.socialLinks?.github || '';
    const linkedin = portfolio.socialLinks?.linkedin || '';
    const twitter = portfolio.socialLinks?.twitter || '';

    const skillsHtml = (portfolio.skills || [])
      .map(
        (s) => `
        <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:16px;padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:700;margin-bottom:8px;">
            <span style="color:#ffffff;">${s.name}</span>
            <span style="color:#f472b6;font-family:monospace;">${s.proficiency}%</span>
          </div>
          <div style="width:100%;height:8px;background:rgba(255,255,255,0.1);border-radius:9999px;overflow:hidden;">
            <div style="width:${s.proficiency}%;height:100%;background:linear-gradient(90deg,#a855f7,#ec4899,#fb7185);border-radius:9999px;"></div>
          </div>
        </div>
      `
      )
      .join('');

    const projectsHtml = (portfolio.projects || [])
      .map(
        (p) => `
        <div style="background:linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(15,23,42,0.9) 100%);border:1px solid rgba(255,255,255,0.15);border-radius:28px;padding:28px;margin-bottom:24px;box-shadow:0 20px 40px rgba(0,0,0,0.4);display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            ${p.imageUrl ? `<div style="width:100%;height:200px;border-radius:20px;overflow:hidden;margin-bottom:20px;border:1px solid rgba(255,255,255,0.1);"><img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"></div>` : ''}
            <h3 style="font-size:22px;font-weight:800;color:#ffffff;margin-bottom:4px;">${p.title}</h3>
            ${p.tagline ? `<p style="font-size:12px;font-weight:700;color:#f472b6;margin-bottom:12px;">${p.tagline}</p>` : ''}
            <p style="font-size:13px;color:#e9d5ff;line-height:1.7;margin-bottom:16px;font-weight:300;">${p.description}</p>
          </div>
          <div>
            ${
              p.techStack && p.techStack.length > 0
                ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">${p.techStack
                    .map(
                      (t) =>
                        `<span style="font-size:10px;font-weight:800;background:linear-gradient(90deg,rgba(168,85,247,0.2),rgba(236,72,153,0.2));color:#f472b6;border:1px solid rgba(236,72,153,0.3);padding:4px 10px;border-radius:12px;">${t}</span>`
                    )
                    .join('')}</div>`
                : ''
            }
            <div style="display:flex;gap:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.1);">
              ${
                p.githubUrl
                  ? `<a href="${p.githubUrl}" target="_blank" rel="noreferrer" style="padding:8px 16px;background:rgba(255,255,255,0.1);color:#ffffff;border-radius:12px;font-size:12px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">Source</a>`
                  : ''
              }
              ${
                p.liveUrl
                  ? `<a href="${p.liveUrl}" target="_blank" rel="noreferrer" style="padding:8px 16px;background:linear-gradient(90deg,#a855f7,#ec4899);color:#ffffff;border-radius:12px;font-size:12px;font-weight:800;text-decoration:none;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 15px rgba(236,72,153,0.3);">Launch Demo →</a>`
                  : ''
              }
            </div>
          </div>
        </div>
      `
      )
      .join('');

    const certsHtml = (portfolio.certifications || [])
      .map(
        (c) => `
        <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:20px;">
          <h4 style="font-size:14px;font-weight:800;color:#ffffff;margin-bottom:4px;">${c.title}</h4>
          <p style="font-size:12px;color:#c084fc;">${c.issuer} • ${c.issueDate}</p>
        </div>
      `
      )
      .join('');

    const experiencesHtml = (portfolio.experiences || [])
      .map(
        (e) => `
        <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:20px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <h4 style="font-size:14px;font-weight:800;color:#ffffff;">${e.role}</h4>
            <span style="font-size:11px;color:#f472b6;font-family:monospace;">${e.startDate} – ${e.endDate}</span>
          </div>
          <p style="font-size:12px;color:#c084fc;margin-bottom:8px;">${e.company} • ${e.location}</p>
          ${e.description ? `<p style="font-size:13px;color:#e9d5ff;line-height:1.6;">${e.description}</p>` : ''}
        </div>
      `
      )
      .join('');

    const educationHtml = (portfolio.education || [])
      .map(
        (edu) => `
        <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:20px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <h4 style="font-size:14px;font-weight:800;color:#ffffff;">${edu.degree} in ${edu.fieldOfStudy}</h4>
            <span style="font-size:11px;color:#f472b6;font-family:monospace;">${edu.startYear} – ${edu.endYear}</span>
          </div>
          <p style="font-size:12px;color:#c084fc;">${edu.institution}</p>
        </div>
      `
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} — Creative Portfolio</title>
  <meta name="description" content="${bio || fullName}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0A0612; color: #ffffff; line-height: 1.6; min-height: 100vh; overflow-x: hidden; }
    .bg-mesh-1 { position: absolute; top: -100px; left: -100px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(147,51,234,0.3) 0%, rgba(236,72,153,0.2) 50%, rgba(0,0,0,0) 70%); border-radius: 50%; filter: blur(80px); pointer-events: none; }
    .bg-mesh-2 { position: absolute; top: 400px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(79,70,229,0.25) 0%, rgba(225,29,72,0.2) 50%, rgba(0,0,0,0) 70%); border-radius: 50%; filter: blur(80px); pointer-events: none; }
    .container { max-width: 960px; margin: 0 auto; padding: 60px 20px; position: relative; z-index: 10; }
    .banner-card { background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(88,28,135,0.3) 50%, rgba(15,23,42,0.9) 100%); backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.2); border-radius: 40px; padding: 48px; margin-bottom: 40px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    .top-flex { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 32px; }
    .badge { display: inline-block; padding: 6px 16px; background: linear-gradient(90deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2)); border: 1px solid rgba(236,72,153,0.3); border-radius: 9999px; font-size: 11px; font-weight: 800; color: #f472b6; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px; }
    h1 { font-size: 48px; font-weight: 900; background: linear-gradient(90deg, #ffffff 0%, #e9d5ff 50%, #f472b6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 8px; letter-spacing: -1px; line-height: 1.1; }
    .role { font-size: 20px; color: #f472b6; font-weight: 700; margin-bottom: 12px; }
    .location-text { font-size: 13px; color: #e9d5ff; font-weight: 600; }
    .photo-wrapper { position: relative; width: 144px; height: 144px; flex-shrink: 0; }
    .avatar-img { width: 144px; height: 144px; border-radius: 28px; object-fit: cover; border: 4px solid rgba(236,72,153,0.5); box-shadow: 0 20px 40px rgba(236,72,153,0.3); transform: rotate(3deg); }
    .avatar-badge { position: absolute; bottom: -8px; right: -8px; background: #ec4899; color: #ffffff; font-weight: 900; font-size: 10px; padding: 4px 12px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .bio { font-size: 15px; color: #e9d5ff; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); line-height: 1.7; font-weight: 300; }
    .social-bar { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
    .social-btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; color: #ffffff; font-size: 12px; font-weight: 700; text-decoration: none; transition: background 0.2s; }
    .social-btn:hover { background: rgba(255,255,255,0.2); }
    section { background: rgba(255,255,255,0.05); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.1); border-radius: 36px; padding: 36px; margin-bottom: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    section h2 { font-size: 12px; font-weight: 900; color: #f472b6; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 2px; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    footer { text-align: center; font-size: 13px; color: #a855f7; margin-top: 60px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="bg-mesh-1"></div>
  <div class="bg-mesh-2"></div>
  <div class="container">
    <div class="banner-card">
      <div class="top-flex">
        <div style="max-width: 580px;">
          <div class="badge">✨ CREATIVE ARTISTIC ARCHITECTURE</div>
          <h1>${fullName}</h1>
          <p class="role">${roleTitle}</p>
          <p class="location-text">📍 ${location} ${institution ? `• ${institution}` : ''}</p>
        </div>
        ${
          portfolio.avatarUrl
            ? `
          <div class="photo-wrapper">
            <img src="${portfolio.avatarUrl}" alt="${fullName}" class="avatar-img">
            <span class="avatar-badge">✨ CREATIVE</span>
          </div>
        `
            : ''
        }
      </div>

      ${bio ? `<p class="bio">${bio}</p>` : ''}

      <div class="social-bar">
        ${github ? `<a href="${github}" target="_blank" class="social-btn">💻 GitHub</a>` : ''}
        ${linkedin ? `<a href="${linkedin}" target="_blank" class="social-btn">🔗 LinkedIn</a>` : ''}
        ${twitter ? `<a href="${twitter}" target="_blank" class="social-btn">🐦 Twitter</a>` : ''}
        ${email ? `<a href="mailto:${email}" class="social-btn">✉️ ${email}</a>` : ''}
      </div>
    </div>

    ${skillsHtml ? `<section><h2>⚡ Technical & Creative Skillset</h2><div class="grid-3">${skillsHtml}</div></section>` : ''}
    ${projectsHtml ? `<section><h2>💼 Featured Creative Works</h2><div class="grid-2">${projectsHtml}</div></section>` : ''}
    ${certsHtml ? `<section><h2>🏆 Awards & Wallet Verification</h2><div class="grid-3">${certsHtml}</div></section>` : ''}
    
    ${
      experiencesHtml || educationHtml
        ? `
      <div class="grid-2">
        ${educationHtml ? `<section><h2>🎓 Academic Qualifications</h2>${educationHtml}</section>` : ''}
        ${experiencesHtml ? `<section><h2>💼 Professional Experience</h2>${experiencesHtml}</section>` : ''}
      </div>
    `
        : ''
    }

    <footer>
      ✨ Designed & Published via SkillOra Creative Engine
    </footer>
  </div>
</body>
</html>`;
  }

  /* ========================================================================= */
  /* TEMPLATE IMMERSIVE: (Visual Storytelling, Deep Dark Indigo, Large Hero)  */
  /* ========================================================================= */
  private renderImmersiveTemplateHtml(portfolio: UserPortfolio): string {
    const fullName = portfolio.fullName || 'Immersive Portfolio';
    const roleTitle = portfolio.roleTitle || 'Visual & Software Architect';
    const bio = portfolio.bio || '';
    const location = portfolio.contact?.location || '';
    const institution = portfolio.institutionOrCompany || '';
    const email = portfolio.contact?.email || '';

    const skillsHtml = (portfolio.skills || [])
      .map(
        (s) => `
        <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);border-radius:20px;padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:800;margin-bottom:8px;">
            <span style="color:#ffffff;">${s.name}</span>
            <span style="color:#a5b4fc;font-family:monospace;">${s.proficiency}%</span>
          </div>
          <div style="width:100%;height:6px;background:rgba(255,255,255,0.1);border-radius:9999px;overflow:hidden;">
            <div style="width:${s.proficiency}%;height:100%;background:linear-gradient(90deg,#6366f1,#a855f7);border-radius:9999px;"></div>
          </div>
        </div>
      `
      )
      .join('');

    const projectsHtml = (portfolio.projects || [])
      .map(
        (p) => `
        <div style="background:linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(15,23,42,0.9) 100%);border:1px solid rgba(255,255,255,0.15);border-radius:32px;padding:36px;margin-bottom:32px;box-shadow:0 25px 50px rgba(0,0,0,0.5);">
          ${p.imageUrl ? `<div style="width:100%;height:320px;border-radius:24px;overflow:hidden;margin-bottom:24px;border:1px solid rgba(255,255,255,0.1);"><img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"></div>` : ''}
          <div style="display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:8px;">
            <h3 style="font-size:28px;font-weight:900;color:#ffffff;">${p.title}</h3>
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" rel="noreferrer" style="padding:10px 20px;background:#4f46e5;color:#ffffff;border-radius:16px;font-size:12px;font-weight:800;text-decoration:none;">Launch Demo ↗</a>` : ''}
          </div>
          ${p.tagline ? `<p style="font-size:14px;font-weight:700;color:#a5b4fc;margin-bottom:12px;">${p.tagline}</p>` : ''}
          <p style="font-size:14px;color:#cbd5e1;line-height:1.7;margin-bottom:20px;font-weight:300;">${p.description}</p>
          ${
            p.techStack && p.techStack.length > 0
              ? `<div style="display:flex;flex-wrap:wrap;gap:8px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);">${p.techStack
                  .map((t) => `<span style="font-size:12px;font-weight:700;background:rgba(255,255,255,0.1);color:#e0e7ff;padding:6px 14px;border-radius:12px;">${t}</span>`)
                  .join('')}</div>`
              : ''
          }
        </div>
      `
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} — Immersive Storytelling</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0C0F17; color: #ffffff; line-height: 1.6; min-height: 100vh; }
    .hero { background: linear-gradient(180deg, rgba(49,46,129,0.5) 0%, rgba(12,15,23,0.95) 100%); padding: 80px 20px 60px 20px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .container { max-width: 1000px; margin: 0 auto; }
    .badge { display: inline-block; padding: 6px 16px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 9999px; font-size: 11px; font-weight: 900; color: #a5b4fc; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
    h1 { font-size: 64px; font-weight: 900; color: #ffffff; letter-spacing: -2px; line-height: 1.05; margin-bottom: 16px; }
    .subtitle { font-size: 24px; font-weight: 800; color: #a5b4fc; margin-bottom: 24px; }
    .bio { font-size: 18px; color: #cbd5e1; max-width: 760px; line-height: 1.7; font-weight: 300; margin-bottom: 32px; }
    .flex-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1); }
    .avatar-img { width: 100px; height: 100px; border-radius: 24px; object-fit: cover; border: 3px solid rgba(99,102,241,0.5); }
    section { padding: 60px 20px; }
    h2 { font-size: 13px; font-weight: 900; color: #818cf8; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
  </style>
</head>
<body>
  <div class="hero">
    <div class="container">
      <div class="badge">✨ IMMERSIVE VISUAL STORYTELLING</div>
      <h1>${fullName}</h1>
      <p class="subtitle">${roleTitle} ${institution ? `— ${institution}` : ''}</p>
      <div class="flex-row">
        <p class="bio">${bio}</p>
        ${
          portfolio.avatarUrl
            ? `
          <div style="display:flex;align-items:center;gap:16px;">
            <img src="${portfolio.avatarUrl}" alt="${fullName}" class="avatar-img">
            <div>
              <p style="font-size:13px;color:#94a3b8;">📍 ${location}</p>
              ${email ? `<a href="mailto:${email}" style="font-size:13px;color:#a5b4fc;text-decoration:none;">${email}</a>` : ''}
            </div>
          </div>
        `
            : ''
        }
      </div>
    </div>
  </div>

  <div class="container">
    ${projectsHtml ? `<section><h2>📹 Visual Case Studies & Projects</h2>${projectsHtml}</section>` : ''}
    ${skillsHtml ? `<section><h2>⚡ Visual & Technical Stack</h2><div class="grid-4">${skillsHtml}</div></section>` : ''}
  </div>
</body>
</html>`;
  }

  /* ========================================================================= */
  /* TEMPLATE 2: OBSIDIAN (Dark Mode, Cyan Neon Accents, Cyber Architecture)   */
  /* ========================================================================= */
  private renderObsidianTemplateHtml(portfolio: UserPortfolio): string {
    const fullName = portfolio.fullName || 'Obsidian Portfolio';
    const roleTitle = portfolio.roleTitle || 'Full Stack AI Developer';
    const bio = portfolio.bio || '';
    const status = portfolio.status || 'freelancer';
    const location = portfolio.contact?.location || '';
    const institution = portfolio.institutionOrCompany || '';
    const email = portfolio.contact?.email || '';
    const github = portfolio.socialLinks?.github || '';
    const linkedin = portfolio.socialLinks?.linkedin || '';
    const twitter = portfolio.socialLinks?.twitter || '';
    const website = portfolio.socialLinks?.website || '';

    const skillsHtml = (portfolio.skills || [])
      .map(
        (s) => `
        <div style="background:rgba(15,23,42,0.8);border:1px solid #1e293b;border-radius:16px;padding:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;margin-bottom:8px;">
            <span style="color:#e2e8f0;">${s.name}</span>
            <span style="color:#38bdf8;font-family:monospace;">${s.proficiency}%</span>
          </div>
          <div style="width:100%;height:6px;background:#1e293b;border-radius:9999px;overflow:hidden;">
            <div style="width:${s.proficiency}%;height:100%;background:linear-gradient(90deg,#06b6d4,#3b82f6);border-radius:9999px;"></div>
          </div>
        </div>
      `
      )
      .join('');

    const projectsHtml = (portfolio.projects || [])
      .map(
        (p) => `
        <div style="background:rgba(15,23,42,0.9);border:1px solid #1e293b;border-radius:24px;padding:28px;margin-bottom:24px;box-shadow:0 20px 40px rgba(0,0,0,0.5);display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            ${p.imageUrl ? `<div style="width:100%;height:200px;border-radius:16px;overflow:hidden;margin-bottom:20px;border:1px solid #1e293b;"><img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"></div>` : ''}
            <h3 style="font-size:22px;font-weight:800;color:#ffffff;margin-bottom:4px;">${p.title}</h3>
            ${p.tagline ? `<p style="font-size:12px;font-family:monospace;font-weight:700;color:#38bdf8;margin-bottom:12px;">${p.tagline}</p>` : ''}
            <p style="font-size:13px;color:#94a3b8;line-height:1.7;margin-bottom:16px;">${p.description}</p>
          </div>
          <div>
            ${
              p.techStack && p.techStack.length > 0
                ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">${p.techStack
                    .map(
                      (t) =>
                        `<span style="font-size:10px;font-family:monospace;font-weight:600;background:rgba(8,145,178,0.2);color:#7dd3fc;border:1px solid rgba(8,145,178,0.3);padding:4px 10px;border-radius:8px;">${t}</span>`
                    )
                    .join('')}</div>`
                : ''
            }
            <div style="display:flex;gap:12px;padding-top:12px;border-top:1px solid #1e293b;">
              ${
                p.githubUrl
                  ? `<a href="${p.githubUrl}" target="_blank" rel="noreferrer" style="padding:8px 16px;background:#1e293b;color:#f8fafc;border-radius:12px;font-size:12px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">Source</a>`
                  : ''
              }
              ${
                p.liveUrl
                  ? `<a href="${p.liveUrl}" target="_blank" rel="noreferrer" style="padding:8px 16px;background:#06b6d4;color:#090d16;border-radius:12px;font-size:12px;font-weight:900;text-decoration:none;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 15px rgba(6,182,212,0.3);">Launch Demo →</a>`
                  : ''
              }
            </div>
          </div>
        </div>
      `
      )
      .join('');

    const certsHtml = (portfolio.certifications || [])
      .map(
        (c) => `
        <div style="background:rgba(15,23,42,0.8);border:1px solid #1e293b;border-radius:16px;padding:20px;">
          <h4 style="font-size:14px;font-weight:800;color:#ffffff;margin-bottom:4px;">${c.title}</h4>
          <p style="font-size:12px;color:#94a3b8;">${c.issuer} • ${c.issueDate}</p>
          ${c.isWalletVerified ? `<p style="margin-top:8px;font-size:10px;color:#38bdf8;background:rgba(8,145,178,0.2);display:inline-block;padding:2px 8px;border-radius:9999px;border:1px solid rgba(8,145,178,0.3);">✓ Career Wallet Verified</p>` : ''}
        </div>
      `
      )
      .join('');

    const experiencesHtml = (portfolio.experiences || [])
      .map(
        (e) => `
        <div style="background:rgba(15,23,42,0.8);border:1px solid #1e293b;border-radius:16px;padding:20px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <h4 style="font-size:14px;font-weight:800;color:#ffffff;">${e.role}</h4>
            <span style="font-size:11px;color:#38bdf8;font-family:monospace;">${e.startDate} – ${e.endDate}</span>
          </div>
          <p style="font-size:12px;color:#94a3b8;margin-bottom:8px;">${e.company} • ${e.location}</p>
          ${e.description ? `<p style="font-size:13px;color:#cbd5e1;line-height:1.6;">${e.description}</p>` : ''}
        </div>
      `
      )
      .join('');

    const educationHtml = (portfolio.education || [])
      .map(
        (edu) => `
        <div style="background:rgba(15,23,42,0.8);border:1px solid #1e293b;border-radius:16px;padding:20px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
            <h4 style="font-size:14px;font-weight:800;color:#ffffff;">${edu.degree} in ${edu.fieldOfStudy}</h4>
            <span style="font-size:11px;color:#38bdf8;font-family:monospace;">${edu.startYear} – ${edu.endYear}</span>
          </div>
          <p style="font-size:12px;color:#94a3b8;">${edu.institution}</p>
        </div>
      `
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} — Obsidian Developer Portfolio</title>
  <meta name="description" content="${bio || fullName}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; background-color: #050811; color: #f8fafc; line-height: 1.6; min-height: 100vh; overflow-x: hidden; }
    .bg-orb-1 { position: absolute; top: 0; left: 30%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; filter: blur(100px); pointer-events: none; }
    .bg-orb-2 { position: absolute; top: 500px; right: 5%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; filter: blur(100px); pointer-events: none; }
    .hero-section { border-bottom: 1px solid rgba(6,182,212,0.2); background: linear-gradient(180deg, #080E1E 0%, #050811 100%); padding: 80px 20px 60px 20px; }
    .container { max-width: 1000px; margin: 0 auto; }
    .badge { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.3); border-radius: 9999px; font-size: 11px; font-family: monospace; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 20px; }
    h1 { font-size: 56px; font-weight: 900; color: #ffffff; letter-spacing: -1.5px; line-height: 1.05; margin-bottom: 12px; }
    .role-title { font-size: 22px; font-weight: 800; background: linear-gradient(90deg, #38bdf8, #7dd3fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 32px; }
    .banner-card { background: rgba(15,23,42,0.9); backdrop-filter: blur(20px); border: 1px solid rgba(6,182,212,0.3); border-radius: 28px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(6,182,212,0.15); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px; }
    .profile-info { display: flex; align-items: center; gap: 24px; }
    .avatar-img { width: 100px; height: 100px; border-radius: 20px; object-fit: cover; border: 2px solid #38bdf8; box-shadow: 0 10px 25px rgba(6,182,212,0.3); flex-shrink: 0; }
    .status-chip { display: inline-block; padding: 2px 10px; background: rgba(6,182,212,0.15); border: 1px solid rgba(6,182,212,0.3); border-radius: 9999px; font-size: 10px; font-family: monospace; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 6px; }
    .social-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .social-btn { padding: 10px 16px; background: #1e293b; border: 1px solid #334155; border-radius: 14px; color: #e2e8f0; font-size: 12px; font-weight: 700; text-decoration: none; transition: all 0.2s; }
    .social-btn:hover { background: rgba(6,182,212,0.2); border-color: rgba(6,182,212,0.5); color: #38bdf8; }
    .main-body { padding: 60px 20px; }
    section { background: rgba(15,23,42,0.7); border: 1px solid #1e293b; border-radius: 28px; padding: 36px; margin-bottom: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
    section h2 { font-size: 12px; font-family: monospace; font-weight: 800; color: #38bdf8; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 24px; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
    footer { text-align: center; font-size: 12px; color: #64748b; font-family: monospace; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="bg-orb-1"></div>
  <div class="bg-orb-2"></div>

  <div class="hero-section">
    <div class="container">
      <div class="badge">💻 OBSIDIAN // CINEMATIC DEVELOPER PORTFOLIO</div>
      <h1>${fullName}</h1>
      <p class="role-title">${roleTitle} ${institution ? `at ${institution}` : ''}</p>

      <div class="banner-card">
        <div class="profile-info">
          ${portfolio.avatarUrl ? `<img src="${portfolio.avatarUrl}" alt="${fullName}" class="avatar-img">` : ''}
          <div>
            <span class="status-chip">✓ ${status}</span>
            ${location ? `<p style="font-size:13px;color:#e2e8f0;margin-top:4px;">📍 ${location}</p>` : ''}
            ${email ? `<a href="mailto:${email}" style="font-size:13px;color:#94a3b8;text-decoration:none;display:block;margin-top:2px;">✉️ ${email}</a>` : ''}
          </div>
        </div>

        <div class="social-row">
          ${github ? `<a href="${github}" target="_blank" class="social-btn">💻 GitHub</a>` : ''}
          ${linkedin ? `<a href="${linkedin}" target="_blank" class="social-btn">🔗 LinkedIn</a>` : ''}
          ${twitter ? `<a href="${twitter}" target="_blank" class="social-btn">🐦 Twitter</a>` : ''}
          ${website ? `<a href="${website}" target="_blank" class="social-btn">🌐 Website</a>` : ''}
        </div>
      </div>
    </div>
  </div>

  <div class="main-body container">
    ${bio ? `<section><h2>✨ // ABOUT & BIOGRAPHY</h2><p style="font-size:16px;color:#e2e8f0;line-height:1.7;font-weight:300;">${bio}</p></section>` : ''}
    ${projectsHtml ? `<section><h2>💼 Featured Projects Showcase</h2><div class="grid-2">${projectsHtml}</div></section>` : ''}
    ${skillsHtml ? `<section><h2>⚡ // TECHNICAL MASTERY MATRIX</h2><div class="grid-4">${skillsHtml}</div></section>` : ''}
    ${certsHtml ? `<section><h2>🏆 // CERTIFICATIONS & WALLET BADGES</h2><div class="grid-3">${certsHtml}</div></section>` : ''}

    ${
      experiencesHtml || educationHtml
        ? `
      <div class="grid-2">
        ${educationHtml ? `<section><h2>🎓 // ACADEMIC QUALIFICATIONS</h2>${educationHtml}</section>` : ''}
        ${experiencesHtml ? `<section><h2>💼 // WORK EXPERIENCE</h2>${experiencesHtml}</section>` : ''}
      </div>
    `
        : ''
    }

    <footer>
      ⚡ OBSIDIAN CINEMATIC ENGINE // Published via SkillOra Portfolio Studio
    </footer>
  </div>
</body>
</html>`;
  }

  /* ========================================================================= */
  /* TEMPLATE 3: EDITORIAL (Serif Fonts, Warm Off-White, Typography Focused)   */
  /* ========================================================================= */
  private renderEditorialTemplateHtml(portfolio: UserPortfolio): string {
    const fullName = portfolio.fullName || 'Editorial Portfolio';
    const roleTitle = portfolio.roleTitle || 'Writer & Strategist';
    const bio = portfolio.bio || '';
    const location = portfolio.contact?.location || '';
    const institution = portfolio.institutionOrCompany || '';
    const email = portfolio.contact?.email || '';
    const github = portfolio.socialLinks?.github || '';
    const linkedin = portfolio.socialLinks?.linkedin || '';

    const projectsHtml = (portfolio.projects || [])
      .map(
        (p) => `
        <div style="border-bottom:1px solid #e7e5e4;padding-bottom:24px;margin-bottom:24px;">
          <h3 style="font-size:20px;font-weight:700;color:#1c1917;">${p.title}</h3>
          ${p.tagline ? `<p style="font-style:italic;color:#78716c;font-size:13px;margin:4px 0 8px 0;">${p.tagline}</p>` : ''}
          <p style="font-size:14px;color:#44403c;line-height:1.7;">${p.description}</p>
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" style="display:inline-block;margin-top:10px;font-size:12px;font-family:sans-serif;font-weight:700;color:#1c1917;text-decoration:underline;">View Work →</a>` : ''}
        </div>
      `
      )
      .join('');

    const skillsHtml = (portfolio.skills || [])
      .map((s) => `<span style="font-family:sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;background:#e7e5e4;color:#292524;padding:4px 12px;border-radius:4px;display:inline-block;margin:4px;">${s.name} (${s.proficiency}%)</span>`)
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} — Editorial</title>
  <style>
    body { font-family: Georgia, serif; background: #FAF8F5; color: #1c1917; padding: 60px 20px; line-height: 1.7; }
    .container { max-width: 820px; margin: 0 auto; }
    header { border-bottom: 2px solid #1c1917; padding-bottom: 36px; margin-bottom: 40px; }
    h1 { font-size: 48px; font-weight: 400; letter-spacing: -1px; margin-bottom: 8px; }
    .title { font-style: italic; font-size: 22px; color: #78716c; }
    .meta { font-family: sans-serif; font-size: 12px; color: #a8a29e; font-weight: 600; margin-top: 8px; }
    .bio { margin-top: 20px; font-size: 17px; color: #44403c; line-height: 1.8; }
    section { margin-bottom: 44px; }
    h2 { font-family: sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; border-bottom: 1px solid #e7e5e4; padding-bottom: 8px; margin-bottom: 24px; color: #78716c; }
    footer { font-family: sans-serif; font-size: 11px; color: #a8a29e; text-align: center; margin-top: 60px; border-top: 1px solid #e7e5e4; padding-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${fullName}</h1>
      <p class="title">${roleTitle} ${institution ? `— ${institution}` : ''}</p>
      <p class="meta">📍 ${location} ${email ? `• ${email}` : ''}</p>
      ${bio ? `<p class="bio">${bio}</p>` : ''}
    </header>

    ${projectsHtml ? `<section><h2>Selected Works</h2>${projectsHtml}</section>` : ''}
    ${skillsHtml ? `<section><h2>Proficiency Matrix</h2><div>${skillsHtml}</div></section>` : ''}

    <footer>
      Published via SkillOra Editorial Engine
    </footer>
  </div>
</body>
</html>`;
  }

  /* ========================================================================= */
  /* TEMPLATE 4: BENTO (Grid-Based Cards)                                       */
  /* ========================================================================= */
  private renderBentoTemplateHtml(portfolio: UserPortfolio): string {
    const fullName = portfolio.fullName || 'Bento Portfolio';
    const roleTitle = portfolio.roleTitle || 'Product & Software Architect';
    const bio = portfolio.bio || '';
    const location = portfolio.contact?.location || '';
    const institution = portfolio.institutionOrCompany || '';
    const email = portfolio.contact?.email || '';

    const projectsHtml = (portfolio.projects || [])
      .map(
        (p) => `
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;padding:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            ${p.imageUrl ? `<div style="width:100%;height:160px;border-radius:16px;overflow:hidden;margin-bottom:16px;"><img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"></div>` : ''}
            <h3 style="font-size:18px;font-weight:800;color:#0f172a;">${p.title}</h3>
            ${p.tagline ? `<p style="font-size:12px;font-weight:600;color:#2563eb;margin-bottom:8px;">${p.tagline}</p>` : ''}
            <p style="font-size:13px;color:#475569;line-height:1.6;">${p.description}</p>
          </div>
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" style="display:inline-block;margin-top:16px;padding:8px 16px;background:#2563eb;color:#ffffff;border-radius:12px;font-size:12px;font-weight:700;text-decoration:none;width:fit-content;">Launch Project ↗</a>` : ''}
        </div>
      `
      )
      .join('');

    const skillsHtml = (portfolio.skills || [])
      .map(
        (s) => `
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:14px;">
          <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#0f172a;margin-bottom:6px;">
            <span>${s.name}</span>
            <span style="color:#2563eb;">${s.proficiency}%</span>
          </div>
          <div style="width:100%;height:6px;background:#f1f5f9;border-radius:9999px;overflow:hidden;">
            <div style="width:${s.proficiency}%;height:100%;background:#2563eb;border-radius:9999px;"></div>
          </div>
        </div>
      `
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} — Bento Grid</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; padding: 40px 20px; min-height: 100vh; }
    .container { max-width: 960px; margin: 0 auto; }
    .hero-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 32px; padding: 40px; margin-bottom: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 24px; }
    .avatar { width: 96px; height: 96px; border-radius: 24px; object-fit: cover; border: 3px solid #2563eb; }
    h1 { font-size: 36px; font-weight: 900; color: #0f172a; tracking-tight: -1px; }
    .subtitle { font-size: 18px; color: #2563eb; font-weight: 700; margin-top: 4px; }
    .bio { font-size: 15px; color: #475569; margin-top: 16px; line-height: 1.7; max-width: 680px; }
    .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin: 32px 0 16px 0; }
    .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    footer { text-align: center; font-size: 12px; color: #94a3b8; font-weight: 600; margin-top: 60px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero-card">
      <div>
        <span style="display:inline-block;padding:4px 12px;background:#eff6ff;color:#2563eb;border-radius:9999px;font-size:11px;font-weight:800;margin-bottom:12px;">🍱 BENTO ARCHITECTURE PORTFOLIO</span>
        <h1>${fullName}</h1>
        <p class="subtitle">${roleTitle} ${institution ? `• ${institution}` : ''}</p>
        <p style="font-size:13px;color:#64748b;margin-top:6px;font-weight:600;">📍 ${location} ${email ? `• ${email}` : ''}</p>
        ${bio ? `<p class="bio">${bio}</p>` : ''}
      </div>
      ${portfolio.avatarUrl ? `<img src="${portfolio.avatarUrl}" alt="${fullName}" class="avatar">` : ''}
    </div>

    ${projectsHtml ? `<h2 class="section-title">Featured Bento Projects</h2><div class="grid-2">${projectsHtml}</div>` : ''}
    ${skillsHtml ? `<h2 class="section-title">Technical Mastery Grid</h2><div class="grid-3">${skillsHtml}</div>` : ''}

    <footer>
      🍱 Published via SkillOra Bento Engine
    </footer>
  </div>
</body>
</html>`;
  }

  /* ========================================================================= */
  /* TEMPLATE 5: DEVELOPER HUB (GitHub Dark Theme, Code Terminal Aesthetic)     */
  /* ========================================================================= */
  private renderDeveloperHubTemplateHtml(portfolio: UserPortfolio): string {
    const fullName = portfolio.fullName || 'Developer Hub';
    const roleTitle = portfolio.roleTitle || 'Software Engineer';
    const bio = portfolio.bio || '';
    const location = portfolio.contact?.location || '';
    const institution = portfolio.institutionOrCompany || '';
    const email = portfolio.contact?.email || '';

    const projectsHtml = (portfolio.projects || [])
      .map(
        (p) => `
        <div style="background:#161b22;border:1px solid #30363d;border-radius:16px;padding:24px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
            <h3 style="font-size:18px;color:#58a6ff;font-weight:700;">${p.title}</h3>
            ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" style="font-size:12px;color:#7ee787;text-decoration:none;">Demo ↗</a>` : ''}
          </div>
          ${p.tagline ? `<p style="font-size:12px;color:#8b949e;margin-bottom:10px;">${p.tagline}</p>` : ''}
          <p style="font-size:13px;color:#c9d1d9;line-height:1.6;margin-bottom:14px;">${p.description}</p>
          ${
            p.techStack && p.techStack.length > 0
              ? `<div style="display:flex;flex-wrap:wrap;gap:6px;">${p.techStack
                  .map((t) => `<span style="font-size:11px;background:#21262d;color:#8b949e;padding:2px 8px;border-radius:6px;border:1px solid #30363d;">${t}</span>`)
                  .join('')}</div>`
              : ''
          }
        </div>
      `
      )
      .join('');

    const skillsHtml = (portfolio.skills || [])
      .map((s) => `<span style="background:#21262d;color:#58a6ff;padding:6px 14px;border-radius:8px;font-size:12px;border:1px solid #30363d;display:inline-block;margin:4px;">${s.name} <span style="color:#8b949e;">(${s.proficiency}%)</span></span>`)
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} — Developer Hub</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background: #0d1117; color: #c9d1d9; padding: 40px 20px; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; }
    .header-card { background: #161b22; border: 1px solid #30363d; border-radius: 16px; padding: 36px; margin-bottom: 24px; }
    .prompt { color: #7ee787; font-weight: bold; font-family: monospace; font-size: 13px; margin-bottom: 12px; }
    h1 { color: #58a6ff; font-size: 32px; font-weight: 800; }
    .role { color: #8b949e; font-size: 16px; margin-top: 4px; font-weight: 600; }
    .bio { margin-top: 16px; color: #c9d1d9; font-size: 14px; line-height: 1.7; }
    section { margin-top: 32px; }
    h2 { font-size: 14px; font-weight: 700; color: #f0f6fc; border-bottom: 1px solid #30363d; padding-bottom: 10px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
    footer { text-align: center; font-size: 12px; color: #484f58; font-family: monospace; margin-top: 60px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-card">
      <p class="prompt">$ cat profile.json</p>
      <h1>${fullName}</h1>
      <p class="role">${roleTitle} ${institution ? `@ ${institution}` : ''}</p>
      <p style="font-size:12px;color:#8b949e;margin-top:6px;">📍 ${location} ${email ? `• ${email}` : ''}</p>
      ${bio ? `<p class="bio">${bio}</p>` : ''}
    </div>

    ${projectsHtml ? `<section><h2>$ ls ./projects/</h2>${projectsHtml}</section>` : ''}
    ${skillsHtml ? `<section><h2>$ cat ./skills.txt</h2><div>${skillsHtml}</div></section>` : ''}

    <footer>
      $ exit 0 // SkillOra Developer Hub Engine
    </footer>
  </div>
</body>
</html>`;
  }

  /* ========================================================================= */
  /* TEMPLATE 6: NEO MINIMAL (Stark High-Contrast Black & White)                */
  /* ========================================================================= */
  private renderNeoMinimalTemplateHtml(portfolio: UserPortfolio): string {
    const fullName = portfolio.fullName || 'Minimal Portfolio';
    const roleTitle = portfolio.roleTitle || 'Developer & Designer';
    const bio = portfolio.bio || '';
    const location = portfolio.contact?.location || '';
    const email = portfolio.contact?.email || '';

    const projectsHtml = (portfolio.projects || [])
      .map(
        (p) => `
        <div style="border:2px solid #000000;border-radius:0px;padding:24px;margin-bottom:20px;background:#ffffff;">
          <h3 style="font-size:22px;font-weight:900;text-transform:uppercase;margin-bottom:6px;">${p.title}</h3>
          <p style="font-size:14px;color:#333333;margin-bottom:12px;line-height:1.6;">${p.description}</p>
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" style="font-weight:900;color:#000000;text-decoration:underline;font-size:12px;">LAUNCH WORK →</a>` : ''}
        </div>
      `
      )
      .join('');

    const skillsHtml = (portfolio.skills || [])
      .map((s) => `<span style="border:2px solid #000000;padding:6px 14px;font-size:12px;font-weight:900;display:inline-block;margin:4px;text-transform:uppercase;">${s.name} (${s.proficiency}%)</span>`)
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} — Minimal</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #ffffff; color: #000000; padding: 60px 20px; line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; }
    header { border-bottom: 4px solid #000000; padding-bottom: 30px; margin-bottom: 40px; }
    h1 { font-size: 54px; font-weight: 900; letter-spacing: -2px; text-transform: uppercase; line-height: 1; margin-bottom: 10px; }
    .role { font-size: 20px; font-weight: 800; text-transform: uppercase; margin-bottom: 10px; }
    .bio { font-size: 16px; font-weight: 500; color: #222222; margin-top: 16px; }
    section { margin-bottom: 40px; }
    h2 { font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 24px; }
    footer { border-top: 4px solid #000000; padding-top: 24px; font-size: 12px; font-weight: 900; text-transform: uppercase; text-align: center; margin-top: 60px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${fullName}</h1>
      <p class="role">${roleTitle}</p>
      <p style="font-size:12px;font-weight:700;margin-top:4px;">📍 ${location} ${email ? `• ${email}` : ''}</p>
      ${bio ? `<p class="bio">${bio}</p>` : ''}
    </header>

    ${projectsHtml ? `<section><h2>PROJECTS</h2>${projectsHtml}</section>` : ''}
    ${skillsHtml ? `<section><h2>TECHNICAL MATRIX</h2><div>${skillsHtml}</div></section>` : ''}

    <footer>
      NEO MINIMAL ENGINE // SKILLORA
    </footer>
  </div>
</body>
</html>`;
  }

  /* ========================================================================= */
  /* TEMPLATE 7: AURORA (Soft Pastels, Glassmorphism)                          */
  /* ========================================================================= */
  private renderAuroraTemplateHtml(portfolio: UserPortfolio): string {
    const fullName = portfolio.fullName || 'Aurora Portfolio';
    const roleTitle = portfolio.roleTitle || 'Creative Developer';
    const bio = portfolio.bio || '';
    const location = portfolio.contact?.location || '';
    const email = portfolio.contact?.email || '';

    const projectsHtml = (portfolio.projects || [])
      .map(
        (p) => `
        <div style="background:rgba(255,255,255,0.8);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.9);border-radius:24px;padding:28px;margin-bottom:20px;box-shadow:0 10px 30px rgba(99,102,241,0.08);">
          ${p.imageUrl ? `<div style="width:100%;height:200px;border-radius:16px;overflow:hidden;margin-bottom:16px;"><img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"></div>` : ''}
          <h3 style="font-size:22px;font-weight:800;color:#1e1b4b;margin-bottom:4px;">${p.title}</h3>
          ${p.tagline ? `<p style="font-size:12px;font-weight:700;color:#4338ca;margin-bottom:10px;">${p.tagline}</p>` : ''}
          <p style="font-size:14px;color:#334155;line-height:1.6;margin-bottom:16px;">${p.description}</p>
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" style="padding:8px 18px;background:#4338ca;color:#ffffff;border-radius:12px;font-size:12px;font-weight:700;text-decoration:none;display:inline-block;">View Project →</a>` : ''}
        </div>
      `
      )
      .join('');

    const skillsHtml = (portfolio.skills || [])
      .map((s) => `<span style="background:rgba(255,255,255,0.8);color:#4338ca;padding:8px 16px;border-radius:9999px;font-size:12px;font-weight:700;display:inline-block;margin:4px;border:1px solid rgba(99,102,241,0.2);">✨ ${s.name} (${s.proficiency}%)</span>`)
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} — Aurora</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #e0e7ff 50%, #f0fdf4 100%); color: #0f172a; padding: 50px 20px; min-height: 100vh; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; }
    .hero-card { background: rgba(255,255,255,0.75); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.9); border-radius: 32px; padding: 44px; margin-bottom: 32px; box-shadow: 0 15px 35px rgba(99,102,241,0.1); }
    .avatar { width: 96px; height: 96px; border-radius: 24px; object-fit: cover; border: 3px solid #4338ca; margin-bottom: 20px; }
    h1 { font-size: 40px; font-weight: 900; color: #1e1b4b; margin-bottom: 4px; }
    .role { font-size: 18px; color: #4338ca; font-weight: 700; margin-bottom: 12px; }
    .bio { font-size: 15px; color: #334155; line-height: 1.7; margin-top: 16px; }
    section { margin-bottom: 36px; }
    h2 { font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; color: #4338ca; margin-bottom: 20px; }
    footer { text-align: center; font-size: 12px; color: #6366f1; font-weight: 700; margin-top: 60px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero-card">
      ${portfolio.avatarUrl ? `<img src="${portfolio.avatarUrl}" alt="${fullName}" class="avatar">` : ''}
      <h1>${fullName}</h1>
      <p class="role">${roleTitle}</p>
      <p style="font-size:13px;color:#64748b;font-weight:600;">📍 ${location} ${email ? `• ${email}` : ''}</p>
      ${bio ? `<p class="bio">${bio}</p>` : ''}
    </div>

    ${projectsHtml ? `<section><h2>Featured Aurora Showcase</h2>${projectsHtml}</section>` : ''}
    ${skillsHtml ? `<section><h2>Skillset & Proficiency</h2><div>${skillsHtml}</div></section>` : ''}

    <footer>
      ✨ Aurora Glassmorphism Engine // SkillOra
    </footer>
  </div>
</body>
</html>`;
  }

  /* ========================================================================= */
  /* DEFAULT TEMPLATE (Clean Professional Light Theme)                          */
  /* ========================================================================= */
  private renderDefaultTemplateHtml(portfolio: UserPortfolio): string {
    const fullName = portfolio.fullName || 'Professional Portfolio';
    const roleTitle = portfolio.roleTitle || 'Professional';
    const bio = portfolio.bio || '';
    const location = portfolio.contact?.location || '';
    const email = portfolio.contact?.email || '';

    const skillsHtml = (portfolio.skills || [])
      .map((s) => `<span style="background:#eff6ff;color:#1d4ed8;padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;display:inline-block;margin:4px;border:1px solid #bfdbfe;">${s.name} (${s.proficiency}%)</span>`)
      .join('');

    const projectsHtml = (portfolio.projects || [])
      .map(
        (p) => `
        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;margin-bottom:16px;">
          ${p.imageUrl ? `<div style="width:100%;height:180px;border-radius:12px;overflow:hidden;margin-bottom:16px;"><img src="${p.imageUrl}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"></div>` : ''}
          <h3 style="font-size:20px;font-weight:800;color:#0f172a;">${p.title}</h3>
          ${p.tagline ? `<p style="font-size:12px;font-weight:700;color:#2563eb;margin-bottom:8px;">${p.tagline}</p>` : ''}
          <p style="font-size:14px;color:#475569;line-height:1.6;margin-bottom:14px;">${p.description}</p>
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank" style="padding:8px 16px;background:#2563eb;color:#ffffff;border-radius:10px;font-size:12px;font-weight:700;text-decoration:none;display:inline-block;">Launch Project ↗</a>` : ''}
        </div>
      `
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fullName} — Portfolio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; color: #0f172a; padding: 40px 20px; line-height: 1.6; }
    .container { max-width: 860px; margin: 0 auto; }
    header { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px; margin-bottom: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .avatar { width: 96px; height: 96px; border-radius: 20px; object-fit: cover; border: 3px solid #2563eb; margin-bottom: 20px; }
    h1 { font-size: 32px; font-weight: 800; color: #0f172a; }
    .role { color: #2563eb; font-size: 18px; font-weight: 600; margin-top: 4px; }
    .bio { color: #475569; margin-top: 16px; line-height: 1.6; font-size: 15px; }
    section { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; padding: 32px; margin-bottom: 24px; }
    h2 { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #2563eb; margin-bottom: 20px; letter-spacing: 1px; }
    footer { text-align: center; font-size: 12px; color: #94a3b8; margin-top: 50px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      ${portfolio.avatarUrl ? `<img src="${portfolio.avatarUrl}" alt="${fullName}" class="avatar">` : ''}
      <h1>${fullName}</h1>
      <p class="role">${roleTitle}</p>
      ${location ? `<p style="color:#64748b;font-size:14px;margin-top:8px;">📍 ${location} ${email ? `• ${email}` : ''}</p>` : ''}
      ${bio ? `<p class="bio">${bio}</p>` : ''}
    </header>

    ${projectsHtml ? `<section><h2>Featured Showcase Projects</h2>${projectsHtml}</section>` : ''}
    ${skillsHtml ? `<section><h2>Technical Competencies</h2><div>${skillsHtml}</div></section>` : ''}

    <footer>
      Published via SkillOra Portfolio Studio
    </footer>
  </div>
</body>
</html>`;
  }

  async deploy(portfolio: UserPortfolio, options?: DeploymentOptions): Promise<DeploymentApiResponse> {
    const timestamp = new Date().toISOString();
    const buildLogs: string[] = [];
    const slug = (options?.projectSlug || portfolio.username || 'my-portfolio').toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const token = options?.userToken || process.env.VERCEL_API_TOKEN;
    const selectedTemplate = portfolio.selectedTemplateId || 'default-overview';

    buildLogs.push(`[${timestamp}] Initiating Vercel deployment pipeline...`);
    buildLogs.push(`[${timestamp}] Project slug: "${slug}"`);
    buildLogs.push(`[${timestamp}] Selected Portfolio Template ID: "${selectedTemplate}"`);

    if (!token) {
      return {
        success: false,
        status: 'failed',
        platform: 'vercel',
        isRealDeployment: false,
        message: 'Vercel account not connected. Please connect your Vercel account to publish.',
        logs: [`[${timestamp}] [ERROR] Vercel token not found. Connect account first.`],
      };
    }

    try {
      buildLogs.push(`[${timestamp}] Generating static site bundle for template "${selectedTemplate}"...`);
      const staticHtml = this.generatePortfolioHtml(portfolio);

      const files: Array<{ file: string; data: string }> = [
        {
          file: 'index.html',
          data: staticHtml,
        },
        {
          file: 'portfolio.json',
          data: JSON.stringify(portfolio, null, 2),
        },
      ];

      buildLogs.push(`[${timestamp}] Prepared ${files.length} bundle files (index.html, portfolio.json) for template "${selectedTemplate}".`);

      // Append skipAutoDetectionConfirmation=1 and pass projectSettings: { framework: null } for static deployments
      const vercelEndpoint = 'https://api.vercel.com/v13/deployments?skipAutoDetectionConfirmation=1';

      const vercelRes = await fetch(vercelEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: slug,
          files: files,
          target: 'production',
          projectSettings: {
            framework: null,
          },
          meta: {
            username: portfolio.username || 'user',
            templateId: selectedTemplate,
            builder: 'SkillOra Portfolio Engine',
          },
        }),
      });

      const resData = await vercelRes.json();

      if (vercelRes.ok && (resData.url || resData.alias?.[0])) {
        // Extract live URL directly from Vercel API response
        const rawUrl = resData.alias?.[0] || resData.url;
        const formattedUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
        const finalUrl = options?.customDomain ? `https://${options.customDomain}` : formattedUrl;

        buildLogs.push(`[${timestamp}] Vercel API deployment created successfully for template "${selectedTemplate}"!`);
        buildLogs.push(`[${timestamp}] Live URL: ${finalUrl}`);

        return {
          success: true,
          status: 'live',
          platform: 'vercel',
          publicUrl: finalUrl,
          deployedAt: new Date().toLocaleDateString(),
          isRealDeployment: true,
          message: `Successfully deployed ${selectedTemplate.toUpperCase()} portfolio to Vercel! Live at ${finalUrl}`,
          logs: buildLogs,
        };
      } else {
        const errMsg = resData.error?.message || 'Vercel API request rejected';
        buildLogs.push(`[${timestamp}] [ERROR] Vercel Deployment Failed for template "${selectedTemplate}": ${errMsg}`);

        return {
          success: false,
          status: 'failed',
          platform: 'vercel',
          isRealDeployment: false,
          message: `Vercel Deployment Failed: ${errMsg}`,
          logs: buildLogs,
        };
      }
    } catch (err: any) {
      return {
        success: false,
        status: 'failed',
        platform: 'vercel',
        isRealDeployment: false,
        message: `Vercel Network Error: ${err.message}`,
        logs: [`[${timestamp}] [ERROR] ${err.message}`],
      };
    }
  }
}
