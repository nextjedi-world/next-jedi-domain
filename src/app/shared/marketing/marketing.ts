import { Component, inject, OnInit } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { APPS, AppConfig } from '../../apps.config';
import { FooterComponent } from '../footer/footer';
import { MARKETING_CONTENT, AppMarketingContent } from '../content/marketing.content';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-shared-marketing',
  imports: [RouterLink, FooterComponent, UserMenuComponent],
  templateUrl: './marketing.html',
  styles: [`
    .sub-page { min-height: 100vh; display: flex; flex-direction: column; }
    .sub-content { flex: 1; padding: 64px 32px 80px; }
    .sub-inner { max-width: var(--max-width-md); margin: 0 auto; }
    .back-link {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.875rem; font-weight: 500; color: var(--color-text-muted);
      margin-bottom: 40px; text-decoration: none; transition: color 0.15s;
    }
    .back-link:hover { color: var(--accent); }
    .back-link .material-symbols-outlined { font-size: 18px; }
    .sub-eyebrow {
      font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: var(--accent); margin-bottom: 8px;
    }
    h1 {
      font-family: var(--font-headline); font-size: 2.25rem; font-weight: 800;
      letter-spacing: -0.02em; color: var(--color-text); margin-bottom: 20px;
    }
    p { color: var(--color-text-muted); line-height: 1.7; }
    .lead { font-size: 1.05rem; }
    h2 {
      font-family: var(--font-headline); font-size: 1.1rem; font-weight: 700;
      color: var(--color-text); margin: 36px 0 8px;
    }
    ul { padding-left: 20px; margin: 8px 0 0; }
    li { color: var(--color-text-muted); line-height: 1.7; margin-bottom: 6px; }
    .verse {
      margin: 36px 0 8px; padding: 28px 28px 24px; text-align: center;
      background: var(--accent-light); border-radius: var(--radius-md);
      border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
    }
    .verse blockquote {
      margin: 0 0 14px; font-size: 1.35rem; line-height: 1.7;
      color: var(--accent-dark); font-weight: 600;
    }
    .verse-line { display: block; }
    .verse-translit { font-style: italic; color: var(--accent); margin-bottom: 14px; }
    .verse figcaption { font-size: 0.9rem; color: var(--accent-dark); line-height: 1.6; }
    .availability { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 40px; }
    .pill {
      padding: 8px 16px; border-radius: 999px; font-size: 0.85rem; font-weight: 600;
      background: var(--accent-light); color: var(--accent-dark);
    }
    .contact { margin-top: 24px; font-size: 0.9rem; }
    .contact a { color: var(--accent); }
    @media (max-width: 560px) {
      .sub-content { padding: 48px 20px 60px; }
      .verse { padding: 20px 16px; }
      .verse blockquote { font-size: 1.15rem; }
    }
  `],
})
export class SharedMarketing implements OnInit {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

  protected app: AppConfig = (() => {
    const slug = this.route.snapshot.data['appSlug'] ?? '';
    return (
      APPS.find((a) => a.slug === slug) ?? {
        slug, name: slug, description: '', category: '', icon: 'apps',
        accent: '#3525cd', accentLight: '#e2dfff', accentDark: '#1a0fa0',
        taglinePrefix: '', taglineAccent: slug, phase: 'development', features: [],
      }
    );
  })();

  protected content: AppMarketingContent | null = MARKETING_CONTENT[this.app.slug] ?? null;

  ngOnInit(): void {
    this.seo.set({
      title: this.content ? `${this.app.name} — ${this.content.headline}` : `${this.app.name} Marketing`,
      description: this.content?.intro ?? `${this.app.name} by Next Jedi.`,
      path: `/${this.app.slug}/marketing`,
    });
  }
}
