import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { APPS, AppConfig } from '../../apps.config';
import { PRIVACY_CONTENT, AppPrivacyContent } from '../content/privacy.content';
import { FooterComponent } from '../footer/footer';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-shared-privacy-policy',
  imports: [RouterLink, FooterComponent],
  templateUrl: './privacy-policy.html',
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
      letter-spacing: -0.02em; color: var(--color-text); margin-bottom: 6px;
    }
    .updated { font-size: 0.8rem; color: var(--color-text-light); margin-bottom: 40px; }
    h2 {
      font-family: var(--font-headline); font-size: 1rem; font-weight: 700;
      color: var(--color-text); margin-top: 32px; margin-bottom: 8px;
    }
    p { color: var(--color-text-muted); line-height: 1.7; font-size: 0.95rem; }
    ul { padding-left: 20px; margin: 8px 0 0; }
    li { color: var(--color-text-muted); line-height: 1.7; font-size: 0.95rem; margin-bottom: 4px; }
    a[href^="mailto"] { color: var(--accent); }
    .contact-block a { overflow-wrap: anywhere; }
    .lead-para + .lead-para { margin-top: 12px; }
    .para-after { margin-top: 12px; }
    .contact-block {
      padding: 16px 20px; border-radius: 12px;
      background: var(--accent-light); border-left: 3px solid var(--accent);
    }
    .contact-block .lead-para + .lead-para { margin-top: 4px; }
    .policy-table-wrap { margin-top: 12px; }
    .policy-table {
      width: 100%; border-collapse: collapse; font-size: 0.9rem;
      border: 1px solid var(--color-border); border-radius: 12px; overflow: hidden;
    }
    .policy-table th {
      text-align: left; font-family: var(--font-headline); font-weight: 700; font-size: 0.8rem;
      color: var(--color-text); background: var(--accent-light); padding: 10px 14px;
    }
    .policy-table td {
      vertical-align: top; color: var(--color-text-muted); line-height: 1.55;
      padding: 10px 14px; border-top: 1px solid var(--color-border);
    }
    @media (max-width: 640px) {
      .policy-table, .policy-table tbody, .policy-table tr, .policy-table td { display: block; width: 100%; }
      .policy-table { border: none; }
      .policy-table thead { display: none; }
      .policy-table tr {
        border: 1px solid var(--color-border); border-radius: 12px;
        padding: 6px 0; margin-bottom: 12px;
      }
      .policy-table td { border-top: none; padding: 6px 16px; }
      .policy-table td::before {
        content: attr(data-label); display: block; font-size: 0.7rem; font-weight: 600;
        text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent);
      }
    }
  `],
})
export class SharedPrivacyPolicy implements OnInit {
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

  protected content: AppPrivacyContent | null = PRIVACY_CONTENT[this.app.slug] ?? null;

  ngOnInit(): void {
    this.seo.set({
      title: `${this.app.name} Privacy Policy`,
      description: `Privacy policy for ${this.app.name} by Next Jedi. See what data the app collects and how it is used.`,
      path: this.route.snapshot.data['canonicalPath'] ?? `/${this.app.slug}/privacy-policy`,
    });
  }
}
