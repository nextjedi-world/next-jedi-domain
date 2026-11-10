import { Component, inject, OnInit } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { APPS, AppConfig } from '../../apps.config';
import { EarlyAccessPanelComponent } from '../download-panel/download-panel';
import { FooterComponent } from '../footer/footer';
import { SeoService, SITE_URL } from '../../seo.service';

const CATEGORY_SCHEMA: Record<string, string> = {
  'Productivity': 'ProductivityApplication',
  'Puzzle': 'GameApplication',
  'Tools': 'UtilitiesApplication',
  'Wellness': 'HealthApplication',
  'Lifestyle': 'LifestyleApplication',
};

@Component({
  selector: 'app-shared-app-page',
  imports: [RouterLink, EarlyAccessPanelComponent, FooterComponent, UserMenuComponent],
  templateUrl: './app-page.html',
  styles: [
    `
    .idea-card-link {
      display: inline-flex; align-items: center; gap: 8px; margin-top: 20px;
      font-size: 0.9rem; font-weight: 600; color: var(--accent-dark);
    }
    .idea-card-link:hover { text-decoration: underline; text-underline-offset: 3px; }
    .idea-card-link .material-symbols-outlined { font-size: 18px; color: var(--accent); }

      .app-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* ---- Hero ---- */
      .app-hero {
        background: linear-gradient(135deg, var(--accent-light) 0%, var(--color-bg) 65%);
        padding: 80px 32px 72px;
      }
      .hero-inner {
        max-width: var(--max-width);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 340px;
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
      .hero-icon {
        font-size: 36px;
        color: var(--accent);
      }
      .hero-icon-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--radius-lg);
        display: block;
      }
      .hero-title {
        font-family: var(--font-headline);
        font-size: clamp(2.5rem, 5vw, 3.5rem);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.03em;
        color: var(--color-text);
        margin-bottom: 16px;
      }
      .hero-title em {
        color: var(--accent);
        font-style: italic;
      }
      .hero-desc {
        font-size: 1.1rem;
        color: var(--color-text-muted);
        line-height: 1.75;
        max-width: 440px;
        margin-bottom: 32px;
      }
      .hero-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }
      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 13px 26px;
        background: var(--accent);
        color: #fff;
        font-weight: 600;
        font-size: 0.95rem;
        font-family: var(--font-body);
        border: none;
        border-radius: var(--radius-full);
        cursor: pointer;
        transition:
          opacity 0.2s,
          transform 0.2s;
      }
      .btn-primary:hover {
        opacity: 0.88;
        transform: translateY(-1px);
      }
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
      .btn-platform:hover {
        opacity: 0.88;
        transform: translateY(-1px);
      }
      .btn-platform .material-symbols-outlined,
      .btn-platform svg {
        font-size: 18px;
        flex-shrink: 0;
      }
      .btn-android {
        background: var(--accent);
        color: #fff;
      }
      .btn-ios {
        background: var(--color-surface);
        color: var(--color-text);
        border: 1.5px solid var(--color-border);
      }
      .btn-coming-soon {
        background: transparent;
        color: var(--color-text-muted);
        border: 1.5px solid var(--color-border);
      }

      /* Phone mockup (right side of hero when screenshots exist) */
      .phone-mockup {
        width: 200px;
        height: 390px;
        background: #111;
        border-radius: 36px;
        box-shadow: var(--shadow-lg), 0 0 0 8px #1a1a1a;
        overflow: hidden;
        position: relative;
      }
      .phone-screenshot {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* Visual card (right side of hero) */
      .hero-visual {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .visual-card {
        width: 200px;
        height: 280px;
        background: var(--color-surface);
        border-radius: 32px;
        box-shadow: var(--shadow-lg);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        border: 1px solid var(--color-border);
        position: relative;
        overflow: hidden;
      }
      .visual-card::before {
        content: '';
        position: absolute;
        top: -40px;
        right: -40px;
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: var(--accent-light);
        opacity: 0.6;
      }
      .visual-icon {
        font-size: 64px;
        color: var(--accent);
        position: relative;
        z-index: 1;
      }
      .visual-name {
        font-family: var(--font-headline);
        font-weight: 700;
        font-size: 1rem;
        color: var(--color-text);
        position: relative;
        z-index: 1;
      }
      .visual-badge {
        font-size: 0.62rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--accent-dark);
        background: var(--accent-light);
        padding: 3px 10px;
        border-radius: var(--radius-full);
        position: relative;
        z-index: 1;
      }

      /* ---- Features ---- */
      .features-section {
        background: var(--color-surface-low);
        padding: 80px 32px;
        flex: 1;
      }
      .section-inner {
        max-width: var(--max-width);
        margin: 0 auto;
      }
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
        transition:
          border-color 0.2s,
          box-shadow 0.2s;
      }
      .feature-card:hover {
        border-color: var(--accent);
        box-shadow: var(--shadow-sm);
      }
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
      .feature-icon {
        font-size: 26px;
        color: var(--accent-dark);
      }
      .feature-title {
        font-family: var(--font-headline);
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: 10px;
      }
      .feature-desc {
        font-size: 0.88rem;
        color: var(--color-text-muted);
        line-height: 1.7;
      }

      /* ---- Screenshots ---- */
      .screenshots-section {
        background: var(--color-bg);
        padding: 80px 32px;
      }
      .screenshots-grid {
        display: flex;
        gap: 32px;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 8px;
      }
      .screenshot-wrap {
        width: 220px;
        height: 430px;
        background: #111;
        border-radius: 36px;
        box-shadow: var(--shadow-lg), 0 0 0 8px #1a1a1a;
        overflow: hidden;
        flex-shrink: 0;
      }
      .screenshot-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      /* ---- CTA ---- */
      .cta-section {
        padding: 80px 32px;
        background: var(--color-bg);
      }
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
        top: -80px;
        right: -80px;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: var(--accent-light);
        opacity: 0.08;
        pointer-events: none;
      }
      .cta-box::after {
        content: '';
        position: absolute;
        bottom: -60px;
        left: -60px;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: var(--accent-light);
        opacity: 0.05;
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
        color: rgba(255, 255, 255, 0.6);
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
      .btn-accent-secondary {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 16px 32px;
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
      .btn-accent-secondary:hover {
        border-color: rgba(255,255,255,0.5);
        color: #fff;
        transform: translateY(-1px);
      }
      .btn-accent-secondary svg { flex-shrink: 0; }
      .btn-accent {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 16px 36px;
        background: var(--accent);
        color: #fff;
        font-weight: 700;
        font-size: 1rem;
        font-family: var(--font-body);
        border: none;
        border-radius: var(--radius-full);
        cursor: pointer;
        transition:
          opacity 0.2s,
          transform 0.2s;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      .btn-accent:hover {
        opacity: 0.88;
        transform: translateY(-1px);
      }
      .cta-note {
        font-size: 0.72rem;
        color: rgba(255, 255, 255, 0.35);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        position: relative;
        z-index: 1;
      }

      /* ---- Responsive ---- */
      @media (max-width: 860px) {
        .hero-inner {
          grid-template-columns: 1fr;
        }
        .hero-visual {
          display: none;
        }
        .features-grid {
          grid-template-columns: 1fr;
        }
        .screenshots-grid {
          gap: 20px;
        }
        .screenshot-wrap {
          width: 180px;
          height: 350px;
        }
      }

      @media (max-width: 560px) {
        .app-hero {
          padding: 60px 20px 56px;
        }
        .features-section {
          padding: 60px 20px;
        }
        .cta-section {
          padding: 60px 20px;
        }
        .cta-box {
          padding: 48px 28px;
        }
      }

    `,
  ],
})
export class AppPage implements OnInit {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

  protected showAndroidPanel = false;
  protected showIosPanel = false;

  protected app: AppConfig = (() => {
    const slug = this.route.snapshot.data['appSlug'] ?? '';
    return (
      APPS.find((a) => a.slug === slug) ?? {
        slug,
        name: slug,
        description: '',
        category: '',
        icon: 'apps',
        accent: '#3525cd',
        accentLight: '#e2dfff',
        accentDark: '#1a0fa0',
        taglinePrefix: '',
        taglineAccent: slug,
        phase: 'development',
        features: [],
      }
    );
  })();

  ngOnInit(): void {
    const { app } = this;
    const ogImage = app.screenshots?.[0]
      ? `${SITE_URL}${app.screenshots[0]}`
      : undefined;

    this.seo.set({
      title: `${app.name} — ${app.description.split('.')[0]}`,
      description: app.description,
      path: `/${app.slug}`,
      image: ogImage,
      keywords: `${app.name}, ${app.category} app, Android, iOS, Next Jedi`,
    });

    this.seo.setJsonLd({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: app.name,
      description: app.description,
      applicationCategory: CATEGORY_SCHEMA[app.category] ?? 'MobileApplication',
      operatingSystem: [app.android ? 'Android' : null, app.ios ? 'iOS' : null]
        .filter(Boolean)
        .join(', '),
      url: `${SITE_URL}/${app.slug}`,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Organization', name: 'Next Jedi', url: SITE_URL },
      ...(app.android?.storeUrl ? { downloadUrl: app.android.storeUrl } : {}),
    });
  }
}
