import { Component, inject, OnInit } from '@angular/core';
import { UserMenuComponent } from '../shared/user-menu/user-menu';
import { RouterLink } from '@angular/router';
import { SeoService } from '../seo.service';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-team',
  imports: [RouterLink, FooterComponent, UserMenuComponent],
  templateUrl: './team.html',
  styles: [
    `
      .team-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        background: var(--color-bg);
      }

      /* ---- Hero ---- */
      .team-hero {
        padding: 96px 32px 80px;
        background: var(--color-bg);
      }
      .hero-inner {
        max-width: var(--max-width);
        margin: 0 auto;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 64px;
      }
      .hero-left { max-width: 640px; }
      .hero-eyebrow {
        display: block;
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: var(--color-primary);
        margin-bottom: 20px;
      }
      .hero-title {
        font-family: var(--font-headline);
        font-size: clamp(2.8rem, 6vw, 4.8rem);
        font-weight: 800;
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: var(--color-text);
      }
      .hero-title em {
        color: var(--color-primary);
        font-style: italic;
      }
      .hero-right {
        flex-shrink: 0;
        max-width: 320px;
        padding-bottom: 4px;
      }
      .hero-desc {
        font-size: 1.05rem;
        color: var(--color-text-muted);
        line-height: 1.8;
        font-weight: 500;
        margin-bottom: 32px;
      }
      .hero-stats {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .hero-stat {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .hero-stat-value {
        font-family: var(--font-headline);
        font-size: 1.6rem;
        font-weight: 800;
        color: var(--color-primary);
        letter-spacing: -0.02em;
        line-height: 1;
      }
      .hero-stat-label {
        font-size: 0.68rem;
        color: var(--color-text-muted);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .hero-stat-divider {
        width: 1px;
        height: 32px;
        background: var(--color-border);
        opacity: 0.5;
      }

      /* ---- Cards Section ---- */
      .cards-section {
        padding: 0 32px 96px;
        background: var(--color-bg);
      }
      .cards-grid {
        max-width: var(--max-width);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 7fr 5fr;
        gap: 24px;
        align-items: start;
      }

      /* ---- Shared Card Base ---- */
      .member-card {
        border-radius: var(--radius-xl);
        padding: 40px;
        position: relative;
        overflow: hidden;
        transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                    box-shadow 0.35s ease;
      }
      .member-card:hover {
        transform: translateY(-4px) scale(1.005);
        box-shadow: 0 24px 64px rgba(53, 37, 205, 0.1);
      }

      /* ---- Primary Card ---- */
      .member-primary {
        background: var(--color-surface);
        display: flex;
        flex-direction: row;
        gap: 36px;
        align-items: center;
        box-shadow: 0 2px 24px rgba(20, 27, 43, 0.06);
      }
      .card-glow {
        position: absolute;
        top: -60px;
        right: -60px;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(53, 37, 205, 0.08) 0%, transparent 70%);
        pointer-events: none;
      }
      .member-photo-wrap {
        flex-shrink: 0;
        overflow: hidden;
        background: var(--color-surface-high);
        position: relative;
      }
      .member-photo-rect {
        width: 160px;
        height: 220px;
        border-radius: var(--radius-lg);
      }
      .member-photo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
        display: block;
        transition: transform 0.5s ease;
      }
      .member-card:hover .member-photo-img {
        transform: scale(1.04);
      }
      /* gradient tint overlay */
      .member-photo-wrap::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          155deg,
          transparent 35%,
          rgba(53, 37, 205, 0.5) 100%
        );
        opacity: 0.6;
        pointer-events: none;
        transition: opacity 0.4s ease;
        z-index: 1;
      }
      .member-card:hover .member-photo-wrap::after {
        opacity: 1;
      }
      /* shimmer sweep on hover */
      .member-photo-wrap::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          110deg,
          transparent 20%,
          rgba(255, 255, 255, 0.12) 50%,
          transparent 80%
        );
        transform: translateX(-100%);
        pointer-events: none;
        transition: transform 0.6s ease;
        z-index: 2;
      }
      .member-card:hover .member-photo-wrap::before {
        transform: translateX(100%);
      }

      /* ---- Member Info ---- */
      .member-info { flex: 1; min-width: 0; }

      .member-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 4px;
      }
      .member-badge {
        flex-shrink: 0;
        background: linear-gradient(135deg, var(--color-primary), #4f46e5);
        color: #fff;
        font-size: 0.65rem;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 99px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        margin-top: 4px;
      }
      .member-badge-sm {
        align-self: flex-end;
      }

      .member-name {
        font-family: var(--font-headline);
        font-size: 1.75rem;
        font-weight: 800;
        color: var(--color-text);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
      .member-name-sm { font-size: 1.4rem; }

      .member-title {
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-primary);
        margin: 8px 0 16px;
      }
      .member-bio {
        font-size: 0.93rem;
        color: var(--color-text-muted);
        line-height: 1.8;
        margin-bottom: 20px;
      }

      /* ---- Chips ---- */
      .member-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 24px;
      }
      .chip {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 5px 12px;
        border-radius: 99px;
        background: var(--color-surface-low);
        color: var(--color-text-muted);
        letter-spacing: 0.02em;
        white-space: nowrap;
      }
      .chip-accent {
        background: rgba(53, 37, 205, 0.08);
        color: var(--color-primary);
      }

      /* ---- Member Footer Row ---- */
      .member-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .member-company {
        font-size: 0.68rem;
        color: var(--color-text-muted);
        font-weight: 500;
        letter-spacing: 0.04em;
        opacity: 0.7;
      }

      /* ---- Links ---- */
      .member-links {
        display: flex;
        gap: 8px;
      }
      .member-links-sm { margin-top: 20px; }
      .member-link {
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        transition: background 0.2s, color 0.2s, transform 0.2s;
      }
      .member-link-pill {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: var(--color-surface-low);
        color: var(--color-text-muted);
      }
      .member-link-pill:hover {
        background: var(--color-primary);
        color: #fff;
        transform: scale(1.1);
      }
      .member-link-pill .material-symbols-outlined { font-size: 18px; }

      /* ---- Secondary Card ---- */
      .member-secondary {
        background: var(--color-surface-low);
        display: flex;
        flex-direction: column;
        margin-top: 48px;
        border-top: 3px solid var(--color-primary);
        gap: 0;
        box-shadow: 0 2px 16px rgba(20, 27, 43, 0.04);
      }
      .secondary-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .member-photo-round {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        overflow: hidden;
        background: var(--color-surface-high);
        box-shadow: 0 0 0 4px var(--color-surface-low),
                    0 0 0 7px rgba(53, 37, 205, 0.15);
      }

      /* ---- Vision Section ---- */
      .vision-section {
        background: var(--color-surface-low);
        padding: 96px 32px;
        flex: 1;
      }
      .vision-inner {
        max-width: var(--max-width);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 80px;
        align-items: center;
      }
      .vision-eyebrow {
        display: block;
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: var(--color-primary);
        margin-bottom: 16px;
      }
      .vision-heading {
        font-family: var(--font-headline);
        font-size: clamp(1.75rem, 3.5vw, 2.75rem);
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--color-text);
        line-height: 1.15;
        margin-bottom: 28px;
      }
      .vision-body {
        display: flex;
        flex-direction: column;
        gap: 18px;
        margin-bottom: 36px;
      }
      .vision-body p {
        font-size: 1rem;
        color: var(--color-text-muted);
        line-height: 1.8;
      }
      .vision-pillars {
        display: flex;
        gap: 24px;
      }
      .pillar {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .pillar-icon {
        font-size: 20px;
        color: var(--color-primary);
      }
      .pillar-label {
        font-size: 0.78rem;
        font-weight: 600;
        color: var(--color-text);
        white-space: nowrap;
      }

      /* Vision Visual */
      .vision-visual { position: relative; }
      .vision-image {
        aspect-ratio: 1;
        border-radius: var(--radius-xl);
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(53, 37, 205, 0.18);
      }
      .vision-gradient {
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg,
          #e2dfff 0%, #c3c0ff 25%, #6c63ff 55%, #3525cd 80%, #1a0fa0 100%);
      }
      .vision-quote {
        position: absolute;
        bottom: -24px;
        left: -32px;
        background: var(--color-surface);
        padding: 24px 28px;
        border-radius: var(--radius-lg);
        box-shadow: 0 12px 40px rgba(20, 27, 43, 0.12);
        max-width: 260px;
        display: none;
      }
      .quote-icon {
        font-size: 28px;
        color: var(--color-primary);
        display: block;
        margin-bottom: 10px;
      }
      .quote-text {
        font-family: var(--font-headline);
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--color-text);
        font-style: italic;
        line-height: 1.5;
      }

      /* ---- Responsive ---- */
      @media (min-width: 1024px) {
        .vision-quote { display: block; }
      }

      @media (max-width: 860px) {
        .hero-inner { flex-direction: column; align-items: flex-start; gap: 32px; }
        .hero-right { max-width: 100%; }
        .cards-grid { grid-template-columns: 1fr; }
        .member-secondary { margin-top: 0; }
        .vision-inner { grid-template-columns: 1fr; }
        .vision-visual { display: none; }
      }

      @media (max-width: 560px) {
        .team-hero { padding: 72px 20px 56px; }
        .cards-section { padding: 0 20px 64px; }
        .member-card { padding: 24px 20px; }
        .member-primary { flex-direction: column; align-items: center; }
        .member-photo-rect { width: 100%; height: 220px; }
        .vision-section { padding: 64px 20px; }
        .vision-pillars { flex-direction: column; gap: 12px; }
        .hero-stats { gap: 14px; }
        .member-footer { flex-direction: column; align-items: flex-start; }
      }
    `,
  ],
})
export class TeamPage implements OnInit {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Meet the Team',
      description: 'The people behind Next Jedi — a small indie studio crafting apps that are beautiful, offline-first, and built to last.',
      path: '/team',
    });
  }
}
