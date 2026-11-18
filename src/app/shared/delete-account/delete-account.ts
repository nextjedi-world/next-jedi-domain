import { Component, inject, OnInit } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { APPS, AppConfig } from '../../apps.config';
import { DELETE_ACCOUNT_CONTENT, AppDeleteAccountContent } from '../content/delete-account.content';
import { FooterComponent } from '../footer/footer';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-shared-delete-account',
  imports: [RouterLink, FooterComponent, UserMenuComponent],
  templateUrl: './delete-account.html',
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
    p + p { margin-top: 8px; }
    ul, ol { padding-left: 20px; margin: 8px 0 0; }
    li { color: var(--color-text-muted); line-height: 1.7; font-size: 0.95rem; margin-bottom: 4px; }
    ol + p { margin-top: 12px; }
    a[href^="mailto"] { color: var(--accent); }
    .email-card {
      margin-top: 24px; padding: 20px 24px; border-radius: 12px;
      background: var(--accent-light); color: var(--accent-dark);
    }
    .email-card p { color: var(--accent-dark); }
    .email-card strong { font-weight: 700; }
    .email-btn {
      display: inline-flex; align-items: center; gap: 8px; margin-top: 12px;
      padding: 10px 18px; border-radius: 999px; background: var(--accent);
      color: #fff !important; font-weight: 600; font-size: 0.9rem; text-decoration: none;
    }
    .email-btn .material-symbols-outlined { font-size: 18px; }
  `],
})
export class SharedDeleteAccount implements OnInit {
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

  protected content: AppDeleteAccountContent | null = DELETE_ACCOUNT_CONTENT[this.app.slug] ?? null;

  protected mailto = this.content
    ? `mailto:${this.content.supportEmail}?subject=${encodeURIComponent(this.content.emailSubject)}`
    : '';

  ngOnInit(): void {
    this.seo.set({
      title: `Delete your ${this.app.name} account`,
      description: `How to delete your ${this.app.name} account and data, in the app or by email, and what is deleted.`,
      path: `/${this.app.slug}/delete-account`,
    });
  }
}
