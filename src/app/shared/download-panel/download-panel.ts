import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PlatformApi } from '../../core/platform-api';
import { SubmissionController } from '../../core/submission';
import { FormErrorComponent } from '../form-error/form-error';
import { AppStage } from '../../apps.config';

export type EarlyAccessPlatform = 'android' | 'ios';

@Component({
  selector: 'app-early-access-panel',
  standalone: true,
  imports: [ReactiveFormsModule, FormErrorComponent],
  template: `
    <div class="panel-backdrop" (click)="closed.emit()"></div>

    <aside class="panel">
      <div class="panel-header">
        <div class="panel-title-row">
          @if (platform === 'android') {
            <span class="material-symbols-outlined panel-platform-icon android">android</span>
          } @else {
            <svg class="panel-platform-icon ios" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          }
          <span class="panel-app-name">{{ appName }}</span>
        </div>
        <button class="panel-close" (click)="closed.emit()" aria-label="Close">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="panel-body">

        <!-- ══════════════════════ COMING SOON ══════════════════════ -->
        @if (stage === 'coming-soon') {
          @if (state() !== 'success') {
            <div class="form-section top-pad">
              <div class="stage-badge badge-coming-soon">
                @if (platform === 'android') {
                  <span class="material-symbols-outlined badge-icon">android</span>
                } @else {
                  <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                }
                {{ platformLabel }} · Coming Soon
              </div>

              <h2 class="form-heading large">Get notified first</h2>
              <p class="form-sub">
                Be first to know when {{ appName }} lands on {{ platformLabel }}.
                We'll reach out personally when it's ready.
              </p>

              <app-form-error
                [state]="submission.state()"
                [otherErrors]="submission.otherErrors()"
                [subject]="appName + ' ' + platformLabel + ' early access'"
                (retry)="onSubmit()"
              />

              <form class="waitlist-form" [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="field">
                  <label class="field-label">Name</label>
                  <input class="field-input" type="text" formControlName="name" placeholder="Your name" />
                  @if (nameCtrl.invalid && nameCtrl.touched) {
                    <span class="field-error">{{ nameCtrl.errors?.['server'] ?? 'Name is required' }}</span>
                  }
                </div>
                <div class="field">
                  <label class="field-label">Email</label>
                  <input class="field-input" type="email" formControlName="email" placeholder="you@example.com" />
                  <div class="hp-field" aria-hidden="true">
                    <input formControlName="website" tabindex="-1" autocomplete="off" aria-label="Website" />
                  </div>
                  @if (emailCtrl.invalid && emailCtrl.touched) {
                    <span class="field-error">
                      @if (emailCtrl.hasError('server')) { {{ emailCtrl.errors?.['server'] }} }
                      @else if (emailCtrl.hasError('required')) { Email is required }
                      @else { Enter a valid email address }
                    </span>
                  }
                </div>
                <button class="btn-submit" type="submit" [disabled]="submission.state() === 'submitting'">
                  @if (submission.state() === 'submitting') { Submitting… }
                  @else { Notify Me }
                  <span class="material-symbols-outlined">
                    {{ submission.state() === 'submitting' ? 'hourglass_empty' : 'notifications' }}
                  </span>
                </button>
              </form>
            </div>
          }

          @if (state() === 'success') {
            <div class="success-section">
              <span class="material-symbols-outlined success-icon">notifications_active</span>
              <h2 class="success-heading">You're on the list!</h2>
              <p class="success-desc">
                We'll reach out personally when {{ appName }} is available on {{ platformLabel }}.
              </p>
            </div>
          }
        }

        <!-- ══════════════════════ EARLY ACCESS ══════════════════════ -->
        @if (stage === 'early-access') {
          @if (state() !== 'success') {
            <div class="store-section">
              <div class="stage-badge badge-early-access">
                <span class="material-symbols-outlined badge-icon">new_releases</span>
                Early Access
              </div>
              <h2 class="store-heading">Get it on {{ platformLabel }}</h2>
              <p class="store-sub">
                Opens the {{ storeName }}. If you're an approved tester you can install directly.
              </p>
              <a class="btn-store" [href]="storeUrl" target="_blank" rel="noopener noreferrer">
                <span class="material-symbols-outlined">open_in_new</span>
                Open {{ storeName }}
              </a>
            </div>

            <div class="divider">
              <span class="divider-label">{{ storeName }} showing an error?</span>
            </div>

            <div class="form-section">
              <h2 class="form-heading">Request tester access</h2>
              <p class="form-sub">
                Leave your email and we'll add you to the {{ platformLabel }} tester list personally.
              </p>

              <app-form-error
                [state]="submission.state()"
                [otherErrors]="submission.otherErrors()"
                [subject]="appName + ' ' + platformLabel + ' early access'"
                (retry)="onSubmit()"
              />

              <form class="waitlist-form" [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="field">
                  <label class="field-label">Name</label>
                  <input class="field-input" type="text" formControlName="name" placeholder="Your name" />
                  @if (nameCtrl.invalid && nameCtrl.touched) {
                    <span class="field-error">{{ nameCtrl.errors?.['server'] ?? 'Name is required' }}</span>
                  }
                </div>
                <div class="field">
                  <label class="field-label">Email</label>
                  <input class="field-input" type="email" formControlName="email" placeholder="you@example.com" />
                  <div class="hp-field" aria-hidden="true">
                    <input formControlName="website" tabindex="-1" autocomplete="off" aria-label="Website" />
                  </div>
                  @if (emailCtrl.invalid && emailCtrl.touched) {
                    <span class="field-error">
                      @if (emailCtrl.hasError('server')) { {{ emailCtrl.errors?.['server'] }} }
                      @else if (emailCtrl.hasError('required')) { Email is required }
                      @else { Enter a valid email address }
                    </span>
                  }
                </div>
                <button class="btn-submit" type="submit" [disabled]="submission.state() === 'submitting'">
                  @if (submission.state() === 'submitting') { Submitting… }
                  @else { Request Access }
                  <span class="material-symbols-outlined">
                    {{ submission.state() === 'submitting' ? 'hourglass_empty' : 'arrow_forward' }}
                  </span>
                </button>
              </form>
            </div>
          }

          @if (state() === 'success') {
            <div class="success-section">
              <span class="material-symbols-outlined success-icon">check_circle</span>
              <h2 class="success-heading">You're on the list!</h2>
              <p class="success-desc">
                We'll review your request and reach out personally with early access to {{ appName }} on {{ platformLabel }}.
              </p>
            </div>
          }
        }

        <!-- ══════════════════════ PRODUCTION ══════════════════════ -->
        @if (stage === 'production') {
          <div class="store-section top-pad">
            <div class="stage-badge badge-production">
              <span class="material-symbols-outlined badge-icon">check_circle</span>
              Available Now
            </div>
            <h2 class="store-heading">Download {{ appName }}</h2>
            <p class="store-sub">
              Available on the {{ storeName }}. Tap below to install.
            </p>
            <a class="btn-store" [href]="storeUrl" target="_blank" rel="noopener noreferrer">
              <span class="material-symbols-outlined">download</span>
              Download from {{ storeName }}
            </a>
          </div>
        }

      </div>
    </aside>
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: flex;
      justify-content: flex-end;
    }

    .panel-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(10, 12, 24, 0.45);
      backdrop-filter: blur(2px);
      animation: fade-in 0.2s ease;
    }

    .panel {
      position: relative;
      width: 440px;
      max-width: 100vw;
      height: 100%;
      background: var(--color-surface);
      box-shadow: -8px 0 48px rgba(0, 0, 0, 0.14);
      display: flex;
      flex-direction: column;
      animation: slide-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 28px;
      border-bottom: 1px solid var(--color-border);
      flex-shrink: 0;
    }

    .panel-title-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .panel-platform-icon.android {
      font-size: 20px;
      color: #3ddc84;
    }

    .panel-platform-icon.ios {
      color: var(--color-text);
    }

    .panel-app-name {
      font-family: var(--font-headline);
      font-weight: 700;
      font-size: 1rem;
      color: var(--color-text);
    }

    .panel-close {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-surface-low);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      color: var(--color-text-muted);
      transition: background 0.15s;
    }

    .panel-close:hover { background: var(--color-surface-high); }

    .panel-body {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    /* ---- Stage badges ---- */
    .stage-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      border-radius: var(--radius-full);
      margin-bottom: 20px;
      align-self: flex-start;
    }

    .badge-icon { font-size: 13px; }

    .badge-coming-soon {
      background: #fef3c7;
      color: #92400e;
    }

    .badge-early-access {
      background: #d1fae5;
      color: #065f46;
    }

    .badge-production {
      background: #dbeafe;
      color: #1e40af;
    }

    /* ---- Store section ---- */
    .store-section {
      padding: 40px 28px 36px;
    }

    .top-pad {
      padding-top: 40px;
    }

    .store-heading {
      font-family: var(--font-headline);
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--color-text);
      margin-bottom: 10px;
    }

    .store-sub {
      font-size: 0.9rem;
      color: var(--color-text-muted);
      line-height: 1.65;
      margin-bottom: 24px;
      max-width: 320px;
    }

    .btn-store {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 26px;
      background: var(--accent);
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
      font-family: var(--font-body);
      border-radius: var(--radius-full);
      text-decoration: none;
      transition: opacity 0.2s, transform 0.2s;
      box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    }

    .btn-store:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn-store .material-symbols-outlined { font-size: 17px; }

    /* ---- Divider ---- */
    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 28px;
      margin-bottom: 4px;
    }

    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--color-border);
    }

    .divider-label {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-text-light);
      white-space: nowrap;
    }

    /* ---- Form section ---- */
    .form-section {
      padding: 20px 28px 36px;
      display: flex;
      flex-direction: column;
    }

    .form-section.top-pad {
      padding-top: 40px;
    }

    .form-heading {
      font-family: var(--font-headline);
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--color-text);
      margin-bottom: 4px;
    }

    .form-heading.large {
      font-size: 1.5rem;
      letter-spacing: -0.02em;
      font-weight: 800;
      margin-bottom: 10px;
    }

    .form-sub {
      font-size: 0.82rem;
      color: var(--color-text-light);
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .form-error-banner {
      padding: 12px 16px;
      background: #fef2f2;
      border-radius: var(--radius-sm);
      color: #991b1b;
      font-size: 0.85rem;
      font-weight: 500;
      border-left: 3px solid #e53e3e;
      margin-bottom: 16px;
    }

    .waitlist-form { display: flex; flex-direction: column; gap: 16px; }

    .field { display: flex; flex-direction: column; gap: 7px; }

    .field-label {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--color-text-light);
    }

    .field-input {
      width: 100%;
      background: var(--color-surface-low);
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: var(--radius-sm);
      padding: 12px 14px;
      font-family: var(--font-body);
      font-size: 0.95rem;
      color: var(--color-text);
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }

    .field-input:focus { border-bottom-color: var(--accent); }
    .field-input::placeholder { color: var(--color-text-light); }

    .field-error { font-size: 0.75rem; color: #e53e3e; font-weight: 500; }

    .btn-submit {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 13px 24px;
      background: var(--color-text);
      color: var(--color-surface);
      font-weight: 700;
      font-size: 0.9rem;
      font-family: var(--font-body);
      border: none;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
      margin-top: 4px;
    }

    .btn-submit:hover:not(:disabled) { opacity: 0.8; transform: translateY(-1px); }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-submit .material-symbols-outlined { font-size: 17px; }

    /* ---- Success ---- */
    .success-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px 36px;
      gap: 16px;
    }

    .success-icon { font-size: 56px; color: #22c55e; }

    .success-heading {
      font-family: var(--font-headline);
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-text);
    }

    .success-desc {
      font-size: 0.95rem;
      color: var(--color-text-muted);
      line-height: 1.7;
      max-width: 280px;
    }

    /* ---- Animations ---- */
    @keyframes slide-in {
      from { transform: translateX(100%); }
      to   { transform: translateX(0); }
    }

    @keyframes fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    @media (max-width: 480px) { .panel { width: 100vw; } }
  `],
})
export class EarlyAccessPanelComponent {
  @Input() platform: EarlyAccessPlatform = 'android';
  @Input() stage: AppStage = 'coming-soon';
  @Input() storeUrl = '';
  @Input() appName = '';
  /** Catalog product id (the app's slug), sent as `product`. */
  @Input() appSlug = '';
  @Input() appIcon = 'apps';
  @Output() closed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private api = inject(PlatformApi);

  state = signal<'default' | 'success'>('default');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    website: [''],
  });
  protected readonly submission = new SubmissionController(this.form);

  get nameCtrl() { return this.form.controls.name; }
  get emailCtrl() { return this.form.controls.email; }

  get platformLabel() { return this.platform === 'android' ? 'Android' : 'iOS'; }
  get storeName() { return this.platform === 'android' ? 'Play Store' : 'App Store'; }

  /** Coming soon: join the waitlist. Early access: ask to be added as a tester. */
  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const { name, email, website } = this.form.getRawValue();
    this.submission.run(
      this.api.submit({
        kind: this.stage === 'coming-soon' ? 'waitlist' : 'tester',
        ...(this.appSlug ? { product: this.appSlug } : {}),
        platform: this.platform,
        name: name.trim(),
        email: email.trim(),
        website,
      }),
      () => this.state.set('success'),
    );
  }
}
