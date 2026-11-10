import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BUSINESS } from '../content/legal.content';

/** Error state for forms: says the save failed, offers a retry and a mailto fallback. */
@Component({
  selector: 'app-form-error',
  template: `
    <div class="form-error-box" role="alert">
      <p class="form-error-text">
        We couldn't save that, so it was not sent. Please try again, or email us at
        <a class="form-error-mail" [href]="mailto">{{ email }}</a>.
      </p>
      <button type="button" class="form-error-retry" (click)="retry.emit()">Try again</button>
    </div>
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
  @Input() subject = 'Message from nextjedi.com';
  @Output() retry = new EventEmitter<void>();

  protected readonly email = BUSINESS.email;

  protected get mailto(): string {
    return `mailto:${BUSINESS.email}?subject=${encodeURIComponent(this.subject)}`;
  }
}
