import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { APPS, AppConfig } from '../../apps.config';
import { SUPPORT_CONTENT, AppSupportContent } from '../content/support.content';
import { FooterComponent } from '../footer/footer';
import { SeoService } from '../../seo.service';
import { AuroraService } from '../../aurora/aurora.service';
import { FormErrorComponent } from '../form-error/form-error';

@Component({
  selector: 'app-shared-support',
  imports: [RouterLink, FooterComponent, ReactiveFormsModule, FormErrorComponent],
  templateUrl: './support.html',
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
      letter-spacing: -0.02em; color: var(--color-text); margin-bottom: 8px;
    }
    .support-intro { color: var(--color-text-muted); line-height: 1.7; font-size: 0.95rem; margin-bottom: 40px; }
    .faq-list { display: flex; flex-direction: column; }
    .faq-item { border-top: 1px solid var(--color-border); padding: 20px 0; }
    .faq-item:last-child { border-bottom: 1px solid var(--color-border); }
    .faq-question {
      font-family: var(--font-headline); font-size: 0.95rem; font-weight: 700;
      color: var(--color-text); margin-bottom: 8px;
    }
    .faq-answer { font-size: 0.9rem; color: var(--color-text-muted); line-height: 1.7; }

    /* ── Contact form ── */
    .contact-form-section {
      margin-top: 56px;
      padding-top: 48px;
      border-top: 1px solid var(--color-border);
    }
    .form-heading {
      font-family: var(--font-headline); font-size: 1.4rem; font-weight: 800;
      letter-spacing: -0.02em; color: var(--color-text); margin-bottom: 6px;
    }
    .form-sub {
      font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 28px; line-height: 1.6;
    }
    .form-card {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: 32px;
    }
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
    .form-group:last-of-type { margin-bottom: 0; }
    .form-label {
      font-size: 0.8rem; font-weight: 600; color: var(--color-text);
      letter-spacing: 0.02em;
    }
    .form-control {
      padding: 10px 14px;
      border: 1.5px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: 0.9rem;
      font-family: inherit;
      transition: border-color 0.15s, box-shadow 0.15s;
      outline: none;
      width: 100%;
      box-sizing: border-box;
    }
    .form-control:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent);
    }
    .form-control.ng-invalid.ng-touched { border-color: #dc2626; }
    textarea.form-control { resize: vertical; min-height: 120px; }
    select.form-control { cursor: pointer; }
    .app-chip {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 14px;
      background: var(--accent-light);
      color: var(--accent-dark);
      border-radius: var(--radius-sm);
      font-size: 0.88rem; font-weight: 600;
      border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    }
    .app-chip .material-symbols-outlined { font-size: 16px; }
    .form-actions { margin-top: 24px; }
    .btn-submit {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 12px 28px;
      background: var(--accent);
      color: #fff;
      border: none; border-radius: var(--radius-sm);
      font-size: 0.9rem; font-weight: 700; font-family: inherit;
      cursor: pointer; transition: opacity 0.2s;
    }
    .btn-submit:hover:not(:disabled) { opacity: 0.88; }
    .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }
    .btn-submit .material-symbols-outlined { font-size: 18px; }
    .form-success {
      display: flex; align-items: flex-start; gap: 12px;
      background: #f0fdf4; border: 1px solid #bbf7d0;
      border-radius: var(--radius-sm); padding: 16px 20px;
      margin-top: 20px;
    }
    .form-success .material-symbols-outlined { font-size: 20px; color: #16a34a; flex-shrink: 0; margin-top: 1px; }
    .form-success p { font-size: 0.9rem; color: #15803d; line-height: 1.5; margin: 0; }
    .form-error {
      display: flex; align-items: flex-start; gap: 12px;
      background: #fef2f2; border: 1px solid #fecaca;
      border-radius: var(--radius-sm); padding: 16px 20px;
      margin-top: 20px;
    }
    .form-error .material-symbols-outlined { font-size: 20px; color: #dc2626; flex-shrink: 0; margin-top: 1px; }
    .form-error p { font-size: 0.9rem; color: #b91c1c; line-height: 1.5; margin: 0; }

    .contact-box {
      margin-top: 24px; background: var(--color-surface-low);
      border: 1px solid var(--color-border); border-radius: var(--radius-md);
      padding: 20px 24px; display: flex; flex-direction: column; gap: 8px;
    }
    .contact-heading {
      font-family: var(--font-headline); font-size: 0.9rem; font-weight: 700; color: var(--color-text);
    }
    .contact-desc { font-size: 0.85rem; color: var(--color-text-muted); line-height: 1.65; }
    .contact-link {
      display: inline-flex; align-items: center; gap: 6px;
      color: var(--accent); font-weight: 600; font-size: 0.875rem; text-decoration: none;
      transition: opacity 0.15s;
    }
    .contact-link:hover { opacity: 0.8; }
    .contact-link .material-symbols-outlined { font-size: 17px; }

    @media (max-width: 560px) {
      .sub-content { padding: 48px 20px 60px; }
      .form-card { padding: 24px 20px; }
    }
  `],
})
export class SharedSupport implements OnInit {
  private route = inject(ActivatedRoute);
  private seo = inject(SeoService);
  private aurora = inject(AuroraService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

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

  protected content: AppSupportContent | null = SUPPORT_CONTENT[this.app.slug] ?? null;
  protected contactEmail = this.content?.contactEmail ?? 'arunabh@nextjedi.com';
  protected allApps = APPS;
  protected hasAppContext = !!this.app.slug && APPS.some(a => a.slug === this.app.slug);

  protected contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    app: [this.hasAppContext ? this.app.name : '', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
  });

  protected isSubmitting = false;
  protected submitSuccess = false;
  protected submitError = false;

  ngOnInit(): void {
    this.seo.set({
      title: `${this.app.name} Support`,
      description: `Support and FAQs for ${this.app.name} by Next Jedi.`,
      path: `/${this.app.slug}/support`,
    });
  }

  protected onSubmitContact(): void {
    if (this.contactForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = false;

    const { name, email, app, message } = this.contactForm.value;
    this.aurora.submitSupport({ name: name!, email: email!, app: app!, message: message! })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.cdr.markForCheck();
          this.contactForm.reset();
          if (this.hasAppContext) {
            this.contactForm.patchValue({ app: this.app.name });
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.submitError = true;
          this.cdr.markForCheck();
        },
      });
  }
}
