import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuroraService } from './aurora.service';
import { SeoService } from '../seo.service';
import { FooterComponent } from '../shared/footer/footer';

@Component({
  selector: 'app-aurora',
  imports: [RouterLink, ReactiveFormsModule, FooterComponent],
  templateUrl: './aurora.html',
  styles: [
    `
      .aurora-page {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      /* ---- Hero ---- */
      .aurora-hero {
        padding: 96px 32px 80px;
        background: var(--color-bg);
        overflow: hidden;
      }
      .hero-grid {
        max-width: var(--max-width);
        margin: 0 auto;
        display: grid;
        grid-template-columns: 7fr 5fr;
        gap: 64px;
        align-items: center;
      }
      .coming-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 16px;
        border-radius: var(--radius-full);
        background: var(--color-surface-high);
        color: var(--color-primary);
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        margin-bottom: 28px;
      }
      .badge-icon {
        font-size: 14px;
      }
      .aurora-title {
        font-family: var(--font-headline);
        font-size: clamp(3rem, 7vw, 5rem);
        font-weight: 800;
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: var(--color-text);
        margin-bottom: 24px;
      }
      .aurora-gradient {
        background: linear-gradient(135deg, var(--color-primary) 0%, #4f46e5 60%, #7c3aed 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .aurora-desc {
        font-size: 1.2rem;
        color: var(--color-text-muted);
        line-height: 1.75;
        max-width: 500px;
      }

      /* Aurora visual */
      .hero-right {
        position: relative;
      }
      .aurora-visual {
        position: relative;
        aspect-ratio: 1;
        border-radius: var(--radius-xl);
        overflow: hidden;
        background: #0d0d1a;
        z-index: 1;
      }
      .aurora-layer {
        position: absolute;
        inset: 0;
        border-radius: inherit;
      }
      .layer-1 {
        background: radial-gradient(ellipse 80% 60% at 30% 20%, rgba(53, 37, 205, 0.95) 0%, transparent 60%);
        mix-blend-mode: screen;
      }
      .layer-2 {
        background: radial-gradient(ellipse 70% 50% at 70% 70%, rgba(124, 58, 237, 0.85) 0%, transparent 55%);
        mix-blend-mode: screen;
      }
      .layer-3 {
        background: radial-gradient(ellipse 60% 40% at 50% 50%, rgba(195, 192, 255, 0.45) 0%, transparent 50%);
        mix-blend-mode: screen;
      }
      .aurora-label-wrap {
        position: absolute;
        bottom: 28px;
        left: 28px;
        display: flex;
        align-items: center;
        gap: 10px;
        background: rgba(249, 249, 255, 0.12);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 10px 18px;
        border-radius: var(--radius-full);
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
      .aurora-star {
        font-size: 18px;
        color: #c3c0ff;
      }
      .aurora-label-text {
        font-family: var(--font-headline);
        font-weight: 700;
        font-size: 0.9rem;
        color: #e2dfff;
        letter-spacing: 0.02em;
      }
      .blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(60px);
        z-index: 0;
        pointer-events: none;
      }
      .blob-top {
        width: 260px;
        height: 260px;
        top: -60px;
        right: -60px;
        background: rgba(53, 37, 205, 0.12);
      }
      .blob-bottom {
        width: 200px;
        height: 200px;
        bottom: -40px;
        left: -40px;
        background: rgba(88, 87, 155, 0.10);
      }

      /* ---- Early Access Form ---- */
      .access-section {
        background: var(--color-surface-low);
        padding: 96px 32px;
      }
      .access-inner {
        max-width: 860px;
        margin: 0 auto;
      }
      .access-header {
        text-align: center;
        margin-bottom: 48px;
      }
      .access-heading {
        font-family: var(--font-headline);
        font-size: 2.25rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--color-text);
        margin-bottom: 10px;
      }
      .access-sub {
        color: var(--color-text-muted);
        font-size: 1rem;
        font-weight: 500;
      }
      .access-card {
        background: var(--color-surface);
        border-radius: var(--radius-xl);
        padding: 48px;
      }
      .access-form {
        display: flex;
        flex-direction: column;
        gap: 28px;
      }
      .form-row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 28px;
      }
      .form-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .field-label {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-text-light);
      }
      .field-input,
      .field-textarea {
        width: 100%;
        background: var(--color-surface-low);
        border: none;
        border-bottom: 2px solid transparent;
        border-radius: var(--radius-sm);
        padding: 14px 16px;
        font-family: var(--font-body);
        font-size: 0.95rem;
        color: var(--color-text);
        outline: none;
        transition: border-color 0.2s;
        resize: none;
      }
      .field-input:focus,
      .field-textarea:focus {
        border-bottom-color: var(--color-primary);
      }
      .field-input::placeholder,
      .field-textarea::placeholder {
        color: var(--color-text-light);
      }
      .form-actions {
        display: flex;
        justify-content: flex-end;
      }
      .btn-waitlist {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 14px 32px;
        background: var(--color-primary);
        color: #fff;
        font-weight: 700;
        font-size: 0.95rem;
        font-family: var(--font-body);
        border: none;
        border-radius: var(--radius-full);
        cursor: pointer;
        transition: opacity 0.2s, transform 0.2s;
      }
      .btn-waitlist:hover {
        opacity: 0.88;
        transform: translateY(-1px);
      }
      .btn-waitlist:active {
        transform: scale(0.98);
      }
      .btn-waitlist .material-symbols-outlined {
        font-size: 18px;
      }

      /* ---- Requests Section ---- */
      .requests-section {
        padding: 96px 32px;
        background: var(--color-bg);
      }
      .requests-inner {
        max-width: var(--max-width);
        margin: 0 auto;
        display: flex;
        gap: 64px;
        align-items: flex-start;
      }
      .requests-left {
        flex: 0 0 280px;
      }
      .requests-sticky {
        position: sticky;
        top: 92px;
      }
      .requests-eyebrow {
        display: block;
        font-size: 0.65rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.18em;
        color: var(--color-primary);
        margin-bottom: 12px;
      }
      .requests-heading {
        font-family: var(--font-headline);
        font-size: 2rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        color: var(--color-text);
        line-height: 1.2;
        margin-bottom: 20px;
      }
      .requests-desc {
        font-size: 0.95rem;
        color: var(--color-text-muted);
        line-height: 1.75;
      }
      .requests-right {
        flex: 1;
        min-width: 0;
      }
      .request-card {
        background: var(--color-surface-high);
        border-radius: var(--radius-xl);
        padding: 40px;
        position: relative;
        overflow: hidden;
        margin-bottom: 20px;
      }
      .request-glow {
        position: absolute;
        top: -40px;
        right: -40px;
        width: 140px;
        height: 140px;
        border-radius: 50%;
        background: rgba(53, 37, 205, 0.06);
        filter: blur(30px);
        pointer-events: none;
      }
      .request-form {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .field-textarea-lg {
        font-size: 1rem;
        padding: 20px;
      }
      .request-footer-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
      }
      .anon-note {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        color: var(--color-text-light);
        font-style: italic;
      }
      .anon-icon {
        font-size: 16px;
      }
      .btn-submit {
        padding: 12px 28px;
        background: var(--color-primary);
        color: #fff;
        font-weight: 700;
        font-size: 0.9rem;
        font-family: var(--font-body);
        border: none;
        border-radius: var(--radius-full);
        cursor: pointer;
        transition: opacity 0.2s, transform 0.2s;
      }
      .btn-submit:hover {
        opacity: 0.88;
        transform: translateY(-1px);
      }
      .btn-submit:active {
        transform: scale(0.98);
      }
      .example-cards {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .example-card {
        background: var(--color-surface-low);
        border-radius: var(--radius-md);
        padding: 24px;
      }
      .example-icon {
        font-size: 24px;
        color: var(--color-primary);
        display: block;
        margin-bottom: 14px;
      }
      .example-quote {
        font-size: 0.85rem;
        font-style: italic;
        font-weight: 500;
        color: var(--color-text-muted);
        line-height: 1.65;
      }

      /* ---- Footer ---- */
      .aurora-footer {
        background: var(--color-surface-highest);
        border-top: 1px solid var(--color-border);
        padding: 40px 32px;
        margin-top: auto;
      }
      .aurora-footer-inner {
        max-width: var(--max-width);
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
      }

      /* ---- Responsive ---- */
      @media (max-width: 860px) {
        .hero-grid {
          grid-template-columns: 1fr;
        }
        .hero-right {
          display: none;
        }
        .requests-inner {
          flex-direction: column;
          gap: 40px;
        }
        .requests-left {
          flex: none;
        }
        .requests-sticky {
          position: static;
        }
        .form-row-2 {
          grid-template-columns: 1fr;
        }
        .example-cards {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 560px) {
        .aurora-hero {
          padding: 72px 20px 60px;
        }
        .access-section {
          padding: 64px 20px;
        }
        .access-card {
          padding: 28px 20px;
        }
        .requests-section {
          padding: 64px 20px;
        }
        .request-card {
          padding: 24px 20px;
        }
      }

      /* ---- Optional label ---- */
      .field-label-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .field-optional {
        font-size: 0.65rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-text-light);
        background: var(--color-surface-high);
        padding: 2px 8px;
        border-radius: var(--radius-full);
      }

      /* ---- Validation ---- */
      .field-input.ng-invalid.ng-touched,
      .field-textarea.ng-invalid.ng-touched {
        border-bottom-color: #e53e3e;
      }
      .field-error {
        font-size: 0.75rem;
        color: #e53e3e;
        font-weight: 500;
      }

      /* ---- Form Feedback ---- */
      .form-error-banner {
        padding: 12px 16px;
        background: #fef2f2;
        border-radius: var(--radius-sm);
        color: #991b1b;
        font-size: 0.875rem;
        font-weight: 500;
        border-left: 3px solid #e53e3e;
      }
      .form-success {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 32px 8px;
      }
      .success-icon {
        font-size: 40px;
        color: #22c55e;
        flex-shrink: 0;
      }
      .success-title {
        font-family: var(--font-headline);
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--color-text);
        margin-bottom: 4px;
      }
      .success-desc {
        font-size: 0.9rem;
        color: var(--color-text-muted);
        margin-bottom: 14px;
      }
      .btn-reset {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-primary);
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        font-family: var(--font-body);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
      .btn-waitlist:disabled,
      .btn-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
      }
    `,
  ],
})
export class AuroraPage implements OnInit {
  private fb = inject(FormBuilder);
  private aurora = inject(AuroraService);
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.set({
      title: 'Project Aurora — Shape What We Build Next',
      description: 'Join Project Aurora and help shape the next generation of Next Jedi apps. Request features, vote on ideas, and get early access before anyone else.',
      path: '/aurora',
      keywords: 'Project Aurora, early access, app feedback, Next Jedi, feature requests',
    });
  }

  readonly steps = ['Email', 'Interests', 'Feature request'] as const;
  readonly interestOptions = [
    'Productivity apps',
    'Games and puzzles',
    'Health and wellness',
    'Developer tools',
    'Creative tools',
  ];

  waitlistForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    feature: [''],
  });

  step = signal(1);
  interests = signal<string[]>([]);
  interestsError = signal(false);
  announcement = signal('');

  ideaForm = this.fb.group({
    description: [''],
  });

  waitlistState: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  ideaState: 'idle' | 'submitting' | 'success' | 'error' = 'idle';

  get wName() { return this.waitlistForm.get('name')!; }
  get wEmail() { return this.waitlistForm.get('email')!; }
  get wFeature() { return this.waitlistForm.get('feature')!; }

  private stepValid(): boolean {
    if (this.step() === 1) {
      this.wName.markAsTouched();
      this.wEmail.markAsTouched();
      return this.wName.valid && this.wEmail.valid;
    }
    if (this.step() === 2) {
      const ok = this.interests().length > 0;
      this.interestsError.set(!ok);
      return ok;
    }
    return true;
  }

  private goTo(n: number) {
    this.step.set(n);
    this.announcement.set(`Step ${n} of ${this.steps.length}: ${this.steps[n - 1]}`);
  }

  nextStep() {
    if (!this.stepValid()) return;
    if (this.step() < this.steps.length) this.goTo(this.step() + 1);
  }

  prevStep() {
    if (this.step() > 1) this.goTo(this.step() - 1);
  }

  toggleInterest(option: string) {
    this.interests.update((cur) =>
      cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option],
    );
    if (this.interests().length > 0) this.interestsError.set(false);
  }

  onJoinWaitlist() {
    if (this.step() < this.steps.length) {
      this.nextStep();
      return;
    }
    if (this.waitlistForm.invalid) {
      this.waitlistForm.markAllAsTouched();
      this.goTo(1);
      return;
    }
    this.waitlistState = 'submitting';
    const { name, email, feature } = this.waitlistForm.value;
    this.aurora
      .submitWaitlist({
        name: name!,
        email: email!,
        feature: feature ?? '',
        app: this.interests().join(', '),
      })
      .subscribe({
        next: () => {
          this.waitlistState = 'success';
          this.waitlistForm.reset();
          this.interests.set([]);
          this.step.set(1);
        },
        // Keep all entered state so the user can retry from the last step.
        error: () => {
          this.waitlistState = 'error';
        },
      });
  }

  onSubmitIdea() {
    this.ideaState = 'submitting';
    const { description } = this.ideaForm.value;
    this.aurora.submitIdea({ description: description! }).subscribe({
      next: () => {
        this.ideaState = 'success';
        this.ideaForm.reset();
      },
      error: () => { this.ideaState = 'error'; },
    });
  }

  resetIdea() {
    this.ideaState = 'idle';
    this.ideaForm.reset();
  }
}
