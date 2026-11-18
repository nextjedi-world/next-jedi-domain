import { Component, inject, OnInit } from '@angular/core';
import { UserMenuComponent } from '../user-menu/user-menu';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LEGAL_DOCS, LegalDoc } from '../content/legal.content';
import { FooterComponent } from '../footer/footer';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-shared-legal',
  imports: [RouterLink, FooterComponent, UserMenuComponent],
  templateUrl: './legal.html',
  styles: [`
    .sub-page { min-height: 100vh; display: flex; flex-direction: column;
      --accent: #3525cd; --accent-light: #e2dfff; --accent-dark: #1a0fa0; }
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
    p { overflow-wrap: anywhere; }
    .links a { color: var(--accent); font-weight: 500; overflow-wrap: anywhere; }
  `],
})
export class SharedLegal implements OnInit {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);

  protected doc: LegalDoc | null = (() => {
    const slug = this.route.snapshot.data['legalDoc'] ?? '';
    return LEGAL_DOCS[slug] ?? null;
  })();

  ngOnInit(): void {
    if (!this.doc) return;
    this.seo.set({
      title: `${this.doc.title} — Next Jedi`,
      description: this.doc.intro,
      path: `/${this.doc.slug}`,
    });
  }
}
