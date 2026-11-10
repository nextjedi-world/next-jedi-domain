import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { PlatformApi } from '../core/platform-api';
import { CatalogProduct, SubmissionRequest } from '../core/platform-api.models';
import { SubmissionController } from '../core/submission';
import { FormErrorComponent } from '../shared/form-error/form-error';
import { OfferProgressComponent } from './offer-progress';

/**
 * The early-adopter card on /ideas/:slug. With a founder offer it files a `kind: early_adopter`
 * submission ("Reserve my spot"); without one, or once the offer is full, a `waitlist` one.
 * Signed-in people skip name and email; their account's are used.
 */
@Component({
  selector: 'app-early-adopter-card',
  imports: [ReactiveFormsModule, RouterLink, FormErrorComponent, OfferProgressComponent],
  templateUrl: './early-adopter-card.html',
  styleUrl: './early-adopter-card.css',
})
export class EarlyAdopterCardComponent {
  private fb = inject(FormBuilder);
  private api = inject(PlatformApi);
  protected auth = inject(AuthService);
  protected router = inject(Router);

  readonly product = input.required<CatalogProduct>();
  /** Emitted after a successful reservation, so the page can refresh the count. */
  readonly reserved = output<void>();

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    website: [''],
  });
  protected readonly submission = new SubmissionController(this.form);
  protected readonly sentTo = signal('');

  protected readonly offer = computed(() => this.product().offer);
  protected readonly full = computed(() => {
    const o = this.offer();
    return !!o && o.claimed >= o.cap;
  });
  /** early_adopter while founder spots are open; otherwise the plain waitlist. */
  protected readonly kind = computed(() =>
    this.offer() && !this.full() ? 'early_adopter' : 'waitlist',
  );
  protected readonly signedInEmail = computed(() => this.auth.user()?.email ?? null);

  protected submit(): void {
    const user = this.auth.user();
    const base: SubmissionRequest = {
      kind: this.kind(),
      product: this.product().id,
      website: this.form.controls.website.value,
    };
    let body: SubmissionRequest;
    if (user?.email) {
      body = { ...base, email: user.email, ...(user.name ? { name: user.name } : {}) };
    } else {
      if (this.form.invalid) {
        this.form.markAllAsTouched();
        return;
      }
      const { name, email } = this.form.getRawValue();
      body = { ...base, name: name.trim(), email: email.trim() };
    }
    this.submission.run(this.api.submit(body), () => {
      this.sentTo.set(body.email ?? '');
      this.reserved.emit();
    });
  }

  protected again(): void {
    this.submission.reset();
  }
}
