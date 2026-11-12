import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APPS } from '../apps.config';
import { SeoService } from '../seo.service';
import { NjReveal } from '../shared/reveal/reveal';
import { NjSkeleton } from '../shared/skeleton/skeleton';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FooterComponent, NjReveal, NjSkeleton],
  templateUrl: './home.html',
  styles: [
    `
      .portfolio {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* ---- Hero ---- */
      .hero {
        position: relative;
        padding: 96px 32px 88px;
        text-align: center;
        overflow: hidden;
      }
      .hero-bg {
        position: absolute;
        inset: 0;
        background: radial-gradient(
          ellipse 80% 60% at 50% 0%,
          rgba(53, 37, 205, 0.06) 0%,
          transparent 70%
        );
        pointer-events: none;
      }
      .hero-inner {
        position: relative;
        z-index: 1;
        max-width: 720px;
        margin: 0 auto;
      }
      .hero-eyebrow {
        display: inline-block;
        font-size: 0.72rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--color-primary);
        margin-bottom: 20px;
      }
      .hero-title {
        font-family: var(--font-headline);
        font-size: clamp(2.4rem, 5.5vw, 3.75rem);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.03em;
        color: var(--color-text);
        margin-bottom: 20px;
      }
      .hero-title em {
        color: var(--color-primary);
        font-style: italic;
      }
      .hero-sub {
        font-size: 1.1rem;
        color: var(--color-text-muted);
        max-width: 500px;
        margin: 0 auto;
        line-height: 1.75;
      }

      /* ---- Phase sections ---- */
      .phase-section {
        padding: 0 32px 64px;
      }
      .phase-section:first-of-type {
        padding-top: 8px;
      }
      .phase-inner {
        max-width: var(--max-width);
        margin: 0 auto;
      }
      .phase-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
      }
      .phase-title {
        font-family: var(--font-headline);
        font-size: 1rem;
        font-weight: 700;
        color: var(--color-text);
        letter-spacing: -0.01em;
      }
      .phase-count {
        font-size: 0.72rem;
        font-weight: 600;
        color: var(--color-text-light);
        margin-left: auto;
        letter-spacing: 0.04em;
      }

      /* ---- Phase pills ---- */
      .phase-pill {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 4px 11px 4px 8px;
        border-radius: var(--radius-full);
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        flex-shrink: 0;
      }
      .pill-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .pill-launched {
        background: #dcfce7;
        color: #15803d;
      }
      .pill-launched .pill-dot {
        background: #16a34a;
        box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.25);
        animation: pulse-green 2s ease-in-out infinite;
      }
      .pill-review {
        background: #fef9c3;
        color: #854d0e;
      }
      .pill-review .pill-dot {
        background: #ca8a04;
      }
      .pill-dev {
        background: #e0f2fe;
        color: #0369a1;
      }
      .pill-dev .pill-dot {
        background: #0284c7;
      }

      /* ---- App grid ---- */
      .app-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }

      /* ---- Cards ---- */
      .app-card {
        display: flex;
        flex-direction: column;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 28px;
        min-height: 220px;
        text-decoration: none;
        color: inherit;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease,
          transform 0.2s ease;
        cursor: pointer;
      }
      .app-card:hover {
        border-color: var(--accent);
        box-shadow: 0 0 0 1px var(--accent), var(--shadow-md);
        transform: translateY(-2px);
        text-decoration: none;
      }
      .card-dev {
        opacity: 0.82;
      }
      .card-dev:hover {
        opacity: 1;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        flex-shrink: 0;
      }
      .card-icon-wrap {
        width: 52px;
        height: 52px;
        border-radius: var(--radius-sm);
        background: var(--accent-light);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        overflow: hidden;
      }
      .card-icon {
        font-size: 26px;
        color: var(--accent-dark);
      }
      .card-icon-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .card-badge {
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--accent-dark);
        background: var(--accent-light);
        padding: 4px 10px;
        border-radius: var(--radius-full);
        white-space: nowrap;
      }
      .card-body {
        flex: 1;
        margin-bottom: 20px;
      }
      .card-name {
        font-family: var(--font-headline);
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: 10px;
        letter-spacing: -0.01em;
      }
      .card-desc {
        font-size: 0.9rem;
        color: var(--color-text-muted);
        line-height: 1.65;
      }
      .card-cta-row {
        margin-top: auto;
        flex-shrink: 0;
      }
      .card-cta {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--accent);
        transition: gap 0.2s;
      }
      .app-card:hover .card-cta { gap: 10px; }
      .cta-arrow { font-size: 18px; }

      /* ---- Nav links ---- */
      .home-nav-links {
        display: flex;
        align-items: center;
        gap: 28px;
        margin-left: auto;
      }
      .home-nav-link {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-muted);
        text-decoration: none;
        transition: color 0.15s;
      }
      .home-nav-link:hover { color: var(--color-primary); }

      /* ---- Animations ---- */
      @keyframes pulse-green {
        0%, 100% { box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.25); }
        50%       { box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.12); }
      }

      /* ---- Responsive ---- */
      @media (max-width: 860px) {
        .app-grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (max-width: 560px) {
        .hero { padding: 60px 20px 52px; }
        .phase-section { padding: 0 20px 48px; }
        .app-grid { grid-template-columns: 1fr; }
      }
    `,
  ],
})
export class Home implements OnInit {
  private seo = inject(SeoService);
  protected launchedApps = APPS.filter(a => a.phase === 'launched');
  protected reviewApps   = APPS.filter(a => a.phase === 'review');
  protected devApps      = APPS.filter(a => a.phase === 'development');

  ngOnInit(): void {
    this.seo.set({
      title: 'Next Jedi — Beautiful Indie Apps for Android & iOS',
      description: 'Next Jedi builds beautiful, offline-first mobile apps for Android and iOS. Explore Flow Timer, Life Mathematics, Sudoku, and more.',
      path: '/',
      keywords: 'mobile apps, Android, iOS, indie app studio, Flow Timer, Life Mathematics, Sudoku, Pomodoro',
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Next Jedi',
      url: 'https://nextjedi.com',
      description: 'Beautiful, offline-first mobile apps for Android and iOS.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://nextjedi.com/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });
  }
}
