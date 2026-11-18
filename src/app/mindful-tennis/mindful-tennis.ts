import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UserMenuComponent } from '../shared/user-menu/user-menu';
import { RouterLink } from '@angular/router';
import { APPS } from '../apps.config';
import { EarlyAccessPanelComponent } from '../shared/download-panel/download-panel';
import { FooterComponent } from '../shared/footer/footer';
import { SeoService, SITE_URL } from '../seo.service';

@Component({
  selector: 'app-mindful-tennis',
  imports: [RouterLink, EarlyAccessPanelComponent, FooterComponent, UserMenuComponent],
  templateUrl: './mindful-tennis.html',
  styles: [`
    .mt-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .mt-app-icon {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      object-fit: cover;
      flex-shrink: 0;
    }

    /* ── Hero ── */
    .mt-hero {
      background: linear-gradient(135deg, var(--accent-light) 0%, var(--color-bg) 65%);
      padding: 80px 32px 72px;
    }
    .hero-inner {
      max-width: var(--max-width);
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 48px;
      align-items: center;
    }
    .hero-badge {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--accent-dark);
      background: var(--accent-light);
      padding: 5px 12px;
      border-radius: var(--radius-full);
      margin-bottom: 24px;
      border: 1px solid var(--color-border);
    }
    .hero-icon-wrap {
      width: 72px;
      height: 72px;
      background: var(--color-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      border: 1px solid var(--color-border);
    }
    .hero-icon { font-size: 36px; color: var(--accent); }
    .hero-title {
      font-family: var(--font-headline);
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: var(--color-text);
      margin-bottom: 16px;
    }
    .hero-title em { color: var(--accent); font-style: italic; }
    .hero-desc {
      font-size: 1.1rem;
      color: var(--color-text-muted);
      line-height: 1.75;
      max-width: 480px;
      margin-bottom: 32px;
    }
    .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn-platform {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 22px;
      font-weight: 600;
      font-size: 0.9rem;
      font-family: var(--font-body);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
      white-space: nowrap;
      border: none;
    }
    .btn-platform:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn-platform .material-symbols-outlined, .btn-platform svg { font-size: 18px; flex-shrink: 0; }
    .btn-coming-soon {
      background: transparent;
      color: var(--color-text-muted);
      border: 1.5px solid var(--color-border);
    }
    .btn-store-live {
      background: var(--accent);
      color: #fff;
      text-decoration: none;
    }

    /* Phone mockup with video */
    .hero-visual { display: flex; justify-content: center; align-items: center; }
    .phone-mockup {
      width: 200px;
      height: 390px;
      background: #111;
      border-radius: 36px;
      box-shadow: var(--shadow-lg), 0 0 0 8px #1a1a1a;
      overflow: hidden;
      position: relative;
    }
    .phone-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* ── Features ── */
    .features-section {
      background: var(--color-surface-low);
      padding: 80px 32px;
      flex: 1;
    }
    .section-inner { max-width: var(--max-width); margin: 0 auto; }
    .section-eyebrow {
      display: block;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 10px;
    }
    .section-heading {
      font-family: var(--font-headline);
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--color-text);
      margin-bottom: 40px;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .feature-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: 28px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .feature-card:hover { border-color: var(--accent); box-shadow: var(--shadow-sm); }
    .feature-icon-wrap {
      width: 52px;
      height: 52px;
      background: var(--accent-light);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    .feature-icon { font-size: 26px; color: var(--accent-dark); }
    .feature-title {
      font-family: var(--font-headline);
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--color-text);
      margin-bottom: 10px;
    }
    .feature-desc { font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.7; }

    /* ── How It Works ── */
    .how-section { background: var(--color-bg); padding: 80px 32px; }
    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 32px;
      row-gap: 16px;
      margin-top: 8px;
    }
    .step {
      display: grid;
      grid-row: span 3;
      grid-template-rows: subgrid;
    }
    .step-header { display: flex; align-items: center; gap: 14px; }
    .step-number {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      font-family: var(--font-headline);
      font-weight: 800;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .step-title {
      font-family: var(--font-headline);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-text);
    }
    .step-desc { font-size: 0.88rem; color: var(--color-text-muted); line-height: 1.7; }
    .step-video-wrap {
      width: 100%;
      aspect-ratio: 9/19;
      background: #111;
      border-radius: 24px;
      box-shadow: var(--shadow-lg), 0 0 0 6px #1a1a1a;
      overflow: hidden;
    }
    .step-video { width: 100%; height: 100%; object-fit: cover; display: block; }

    /* ── Screenshots ── */
    .screenshots-section { background: var(--color-surface-low); padding: 80px 32px; }
    .screenshots-grid {
      display: flex;
      gap: 24px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .screenshot-wrap {
      width: 200px;
      height: 390px;
      background: #111;
      border-radius: 36px;
      box-shadow: var(--shadow-lg), 0 0 0 8px #1a1a1a;
      overflow: hidden;
      flex-shrink: 0;
    }
    .screenshot-img { width: 100%; height: 100%; object-fit: cover; display: block; }

    /* ── Promise ── */
    .promise-section { background: #0a0f1a; padding: 80px 32px; }
    .promise-section .section-eyebrow { color: var(--accent-light); }
    .promise-section .section-heading { color: #fff; }
    .promise-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .promise-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: var(--radius-md);
      padding: 28px;
      transition: background 0.2s, border-color 0.2s;
    }
    .promise-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.15); }
    .promise-icon-wrap {
      width: 48px;
      height: 48px;
      background: rgba(5,150,105,0.18);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .promise-icon { font-size: 24px; color: #6ee7b7; }
    .promise-title {
      font-family: var(--font-headline);
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }
    .promise-desc { font-size: 0.85rem; color: rgba(255,255,255,0.55); line-height: 1.65; }

    /* ── CTA ── */
    .cta-section { padding: 80px 32px; background: var(--color-bg); }
    .cta-box {
      background: #0d0d1a;
      border-radius: var(--radius-xl);
      padding: 72px 48px;
      text-align: center;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
    }
    .cta-box::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 300px; height: 300px;
      border-radius: 50%;
      background: var(--accent-light);
      opacity: 0.07;
      pointer-events: none;
    }
    .cta-heading {
      font-family: var(--font-headline);
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 800;
      color: #fff;
      margin-bottom: 12px;
      position: relative;
      z-index: 1;
    }
    .cta-sub {
      font-size: 1.05rem;
      color: rgba(255,255,255,0.6);
      max-width: 400px;
      margin: 0 auto 36px;
      line-height: 1.7;
      position: relative;
      z-index: 1;
    }
    .cta-actions {
      position: relative;
      z-index: 1;
      margin-bottom: 20px;
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn-cta-ghost {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: transparent;
      color: rgba(255,255,255,0.7);
      font-weight: 600;
      font-size: 0.95rem;
      font-family: var(--font-body);
      border: 1.5px solid rgba(255,255,255,0.2);
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s, transform 0.2s;
    }
    .btn-cta-ghost:hover { border-color: rgba(255,255,255,0.5); color: #fff; transform: translateY(-1px); }
    .btn-cta-ghost svg, .btn-cta-ghost .material-symbols-outlined { font-size: 18px; flex-shrink: 0; }
    .cta-note {
      font-size: 0.72rem;
      color: rgba(255,255,255,0.3);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      position: relative;
      z-index: 1;
    }

    /* ── Responsive ── */
    @media (max-width: 860px) {
      .hero-inner { grid-template-columns: 1fr; }
      .hero-visual { display: none; }
      .features-grid, .steps-grid, .promise-grid { grid-template-columns: 1fr; }
      .screenshots-grid { gap: 16px; }
      .screenshot-wrap { width: 160px; height: 312px; }
      .step-video-wrap { width: 160px; margin: 0 auto; }
    }
    @media (max-width: 560px) {
      .mt-hero, .features-section, .how-section,
      .screenshots-section, .promise-section, .cta-section { padding: 60px 20px; }
      .cta-box { padding: 48px 24px; }
    }
  `],
})
export class MindfulTennisPage implements OnInit, AfterViewInit, OnDestroy {
  private seo = inject(SeoService);

  protected app = APPS.find(a => a.slug === 'mindful-tennis')!;
  protected showAndroidPanel = false;
  protected showIosPanel = false;
  protected activeSection: string | null = null;
  private observer: IntersectionObserver | null = null;
  private videoObserver: IntersectionObserver | null = null;

  scrollToSection(id: string, event: Event): void {
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  protected features = [
    {
      icon: 'timer',
      title: 'Session Tracking',
      description: 'Start a session, set your focus point, and let the timer run in the background — even when your screen is off.',
    },
    {
      icon: 'star_rate',
      title: '8-Aspect Self-Rating',
      description: 'After each session, rate your forehand, backhand, serve, return, volley, slice, movement, and mindset on a 1–5 scale.',
    },
    {
      icon: 'scoreboard',
      title: 'Match Score Logging',
      description: 'Record set-by-set results for singles and doubles matches, including partner and opponent details.',
    },
    {
      icon: 'trending_up',
      title: 'Performance Trends',
      description: 'Visualise your progress over 1W, 1M, 3M, 6M, or 1Y with clean line charts and aspect breakdowns.',
    },
    {
      icon: 'group',
      title: 'Opponent & Partner History',
      description: 'Build your roster automatically. See win/loss records and average scores for every opponent and partner.',
    },
    {
      icon: 'cloud_sync',
      title: 'Offline-First, Cloud-Synced',
      description: 'All data is stored locally first. Sign in with Google to sync securely across devices whenever you\'re online.',
    },
  ];

  protected howItWorks = [
    {
      number: '1',
      title: 'Start a Session',
      description: 'Set your focus point for the day, hit start, and play. The timer keeps running in the background with a persistent notification.',
      video: '/apps/mindful-tennis/start-session.mp4',
      poster: '/apps/mindful-tennis/screenshot-new-session.jpeg',
    },
    {
      number: '2',
      title: 'Rate Your Game',
      description: 'After the session, rate all 8 aspects of your game, log the set scores, and add any notes or reflections.',
      video: '/apps/mindful-tennis/feedback.mp4',
      poster: '/apps/mindful-tennis/screenshot-rate-session.jpeg',
    },
    {
      number: '3',
      title: 'Track Your Progress',
      description: 'Open the dashboard to see your performance trends, aspect averages, and how you\'re doing against each opponent over time.',
      video: '/apps/mindful-tennis/dashboard.mp4',
      poster: '/apps/mindful-tennis/screenshot-dashboard.jpeg',
    },
  ];

  protected screenshots = [
    { src: '/apps/mindful-tennis/screenshot-dashboard.jpeg', alt: 'Performance dashboard' },
    { src: '/apps/mindful-tennis/screenshot-dashboard-2.jpeg', alt: 'Aspect breakdown' },
    { src: '/apps/mindful-tennis/screenshot-new-session.jpeg', alt: 'Start a new session' },
    { src: '/apps/mindful-tennis/screenshot-rate-session.jpeg', alt: 'Rate your session' },
    { src: '/apps/mindful-tennis/screenshot-session-detail.jpeg', alt: 'Session detail' },
  ];

  protected promises = [
    {
      icon: 'sports_tennis',
      title: 'Built by Tennis Enthusiasts',
      description: 'Designed by players who understand the mental side of the game — not a generic fitness app.',
    },
    {
      icon: 'block',
      title: 'No Ads. Ever.',
      description: 'Your focus session is sacred. No banners, no interstitials, no distractions — ever.',
    },
    {
      icon: 'wifi_off',
      title: 'Offline-First',
      description: 'Play and track without internet. Your data lives on your device first — cloud is a bonus.',
    },
    {
      icon: 'payments',
      title: 'Under $5',
      description: 'Less than the cost of a can of balls. Exact price varies by region to keep it fair everywhere.',
    },
    {
      icon: 'feedback',
      title: 'Built From Your Feedback',
      description: 'Every update is shaped by what real players ask for. You play it, we build it.',
    },
  ];

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.activeSection = entry.target.id;
          }
        }
      },
      { rootMargin: '-20% 0px -65% 0px' }
    );
    ['features', 'how-it-works', 'dashboard'].forEach(id => {
      const el = document.getElementById(id);
      if (el) this.observer!.observe(el);
    });

    const setupVideoObserver = () => {
      this.videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.25 }
      );
      document.querySelectorAll<HTMLVideoElement>('.step-video').forEach(v => this.videoObserver!.observe(v));
    };

    if (document.readyState === 'complete') {
      setupVideoObserver();
    } else {
      window.addEventListener('load', setupVideoObserver, { once: true });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.videoObserver?.disconnect();
  }

  ngOnInit(): void {
    this.seo.set({
      title: 'Mindful Tennis — Track Your Game, Elevate Your Mind',
      description: 'Log sessions, rate 8 aspects of your game, track performance trends, and build a stronger mental game. Offline-first, no subscription.',
      path: '/mindful-tennis',
      keywords: 'tennis tracker, tennis app, match journal, tennis performance, mental tennis, Android tennis app',
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Mindful Tennis',
      description: 'Track your tennis sessions, rate 8 aspects of your game, and follow your performance trends over time.',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Android, iOS',
      url: `${SITE_URL}/mindful-tennis`,
      offers: { '@type': 'Offer', price: '5', priceCurrency: 'USD' },
      author: { '@type': 'Organization', name: 'Next Jedi', url: SITE_URL },
    });
  }
}
