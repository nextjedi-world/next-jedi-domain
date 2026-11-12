import { Component, computed, input, output } from '@angular/core';
import { SubmitState } from '../../core/submission';
import { BUSINESS } from '../content/legal.content';

/**
 * Error states for forms that post to platform-api:
 * - `error`: the save failed; offers a retry and a mailto fallback.
 * - `rate_limited`: too many tries (429); asks to wait, still offers mailto.
 * - `invalid`: the server rejected some fields; field messages sit under each input,
 *   and any field without an input is listed here.
 */
@Component({
  selector: 'app-form-error',
  template: `
    @if (state() === 'error') {
      <div class="form-error-box" role="alert">
        <p class="form-error-text">
          We couldn't save that, so it was not sent. Please try again, or email us at
          <a class="form-error-mail" [href]="mailto()">{{ email }}</a
          >.
        </p>
        <button type="button" class="form-error-retry" (click)="retry.emit()">Try again</button>
      </div>
    } @else if (state() === 'rate_limited') {
      <div class="form-error-box" role="alert">
        <p class="form-error-text">
          That's a lot of tries in a short time. Please wait a minute and try again, or email us at
          <a class="form-error-mail" [href]="mailto()">{{ email }}</a
          >.
        </p>
      </div>
    } @else if (state() === 'invalid') {
      <div class="form-error-box" role="alert">
        <p class="form-error-text">Please check the highlighted fields and try again.</p>
        @for (msg of otherErrors(); track msg) {
          <p class="form-error-text">{{ msg }}</p>
        }
      </div>
    }
  `,
  styles: [
    `
      .form-error-box {
        padding: 12px 16px;
        background: #fef2f2;
        border-radius: var(--radius-sm);
        border-left: 3px solid #e53e3e;
        color: #991b1b;
        font-size: 0.875rem;
        font-weight: 500;
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
        text-align: left;
      }
      .form-error-text {
        margin: 0;
        line-height: 1.5;
      }
      .form-error-mail {
        color: inherit;
        text-decoration: underline;
      }
      .form-error-retry {
        background: none;
        border: 1px solid currentColor;
        color: inherit;
        border-radius: var(--radius-full);
        padding: 4px 14px;
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }
    `,
  ],
})
export class FormErrorComponent {
  readonly state = input.required<SubmitState>();
  readonly otherErrors = input<string[]>([]);
  readonly subject = input('Message from nextjedi.com');
  readonly retry = output<void>();

  protected readonly email = BUSINESS.email;
  protected readonly mailto = computed(
    () => `mailto:${BUSINESS.email}?subject=${encodeURIComponent(this.subject())}`,
  );
}
