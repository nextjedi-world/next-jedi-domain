import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { log } from '../observability/logger';

/** What went wrong with a POST /v1/submissions, from the SPA's point of view. */
export type SubmitFailure =
  | { kind: 'validation'; fields: Record<string, string> }
  | { kind: 'rate_limited' }
  | { kind: 'error'; status: number };

export function toSubmitFailure(err: unknown): SubmitFailure {
  if (err instanceof HttpErrorResponse) {
    const body = err.error as { error?: string; fields?: Record<string, string> } | null;
    if (err.status === 400 && body?.error === 'validation') {
      return { kind: 'validation', fields: body.fields ?? {} };
    }
    if (err.status === 429) {
      return { kind: 'rate_limited' };
    }
    return { kind: 'error', status: err.status };
  }
  return { kind: 'error', status: 0 };
}

/** Human text for a server validation reason. The server sends short machine reasons. */
export function describeFieldReason(field: string, reason: string): string {
  const r = reason.toLowerCase();
  if (field === 'email' && (r.includes('email') || r.includes('invalid'))) {
    return 'Enter a valid email address.';
  }
  if (r.includes('required')) return 'This field is required.';
  if (r.includes('too_long') || r.includes('max') || r.includes('long')) return 'This is too long.';
  return reason.charAt(0).toUpperCase() + reason.slice(1).replace(/_/g, ' ') + '.';
}

/**
 * Puts server field errors on the matching form controls as `{ server: message }` and returns
 * the ones that have no control (shown in a banner instead).
 */
export function applyFieldErrors(form: FormGroup, fields: Record<string, string>): string[] {
  const unmatched: string[] = [];
  for (const [name, reason] of Object.entries(fields)) {
    const ctrl: AbstractControl | null = form.get(name);
    const message = describeFieldReason(name, reason);
    if (ctrl) {
      ctrl.setErrors({ ...(ctrl.errors ?? {}), server: message });
      ctrl.markAsTouched();
    } else {
      unmatched.push(`${name}: ${message}`);
    }
  }
  return unmatched;
}

export type SubmitState = 'idle' | 'submitting' | 'success' | 'invalid' | 'rate_limited' | 'error';

/** Signal-based state for one form that posts to platform-api. */
export class SubmissionController {
  readonly state = signal<SubmitState>('idle');
  /** Server field errors with no matching control. */
  readonly otherErrors = signal<string[]>([]);

  constructor(private readonly form: FormGroup) {}

  run<T>(request: Observable<T>, onSuccess?: (value: T) => void): void {
    if (this.state() === 'submitting') return;
    this.state.set('submitting');
    this.otherErrors.set([]);
    request.subscribe({
      next: (value) => {
        this.state.set('success');
        onSuccess?.(value);
      },
      error: (err: unknown) => {
        const failure = toSubmitFailure(err);
        if (failure.kind === 'validation') {
          this.otherErrors.set(applyFieldErrors(this.form, failure.fields));
          this.state.set('invalid');
        } else if (failure.kind === 'rate_limited') {
          this.state.set('rate_limited');
        } else {
          log.warn('submission failed', { status: failure.status });
          this.state.set('error');
        }
      },
    });
  }

  reset(): void {
    this.state.set('idle');
    this.otherErrors.set([]);
  }
}
