import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from './toast.service';

/** Render once near the app root; push messages through ToastService. */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nj-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nj-toast-region" role="region" aria-label="Notifications">
      @for (t of service.toasts(); track t.id) {
        <div
          [class]="'nj-toast nj-toast-' + t.kind"
          [attr.role]="t.kind === 'error' ? 'alert' : 'status'"
          [attr.aria-live]="t.kind === 'error' ? 'assertive' : 'polite'"
        >
          <span class="nj-toast-message">{{ t.message }}</span>
          <button type="button" class="nj-toast-close" aria-label="Dismiss" (click)="service.dismiss(t.id)">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .nj-toast-region {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-width: min(360px, calc(100vw - 32px));
    }
    .nj-toast {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 14px;
      background: var(--color-surface);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-left: 4px solid var(--accent);
      border-radius: var(--radius-sm);
      box-shadow: var(--shadow-md);
      font-family: var(--font-body);
      font-size: 0.9rem;
    }
    .nj-toast-success {
      border-left-color: var(--color-success);
    }
    .nj-toast-error {
      border-left-color: var(--color-danger);
    }
    .nj-toast-message {
      flex: 1;
    }
    .nj-toast-close {
      background: none;
      border: 0;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
      color: var(--color-text-muted);
    }
  `,
})
export class NjToast {
  protected readonly service = inject(ToastService);
}
