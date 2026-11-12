import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NjButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nj-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [class]="'nj-btn nj-btn-' + variant()"
      [attr.type]="type()"
      [disabled]="disabled() || pending()"
      [attr.aria-busy]="pending() ? 'true' : null"
    >
      @if (pending()) {
        <span class="nj-btn-spinner" aria-hidden="true"></span>
      }
      <span class="nj-btn-label"><ng-content /></span>
    </button>
  `,
  styles: `
    .nj-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 20px;
      font-family: var(--font-headline);
      font-weight: 700;
      font-size: 0.95rem;
      border: 1px solid transparent;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition:
        background 0.15s,
        opacity 0.15s;
    }
    .nj-btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .nj-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .nj-btn-primary {
      background: var(--accent);
      color: #fff;
    }
    .nj-btn-primary:hover:not(:disabled) {
      background: var(--accent-dark);
    }
    .nj-btn-secondary {
      background: var(--accent-light);
      color: var(--accent-dark);
    }
    .nj-btn-ghost {
      background: transparent;
      color: var(--accent);
      border-color: var(--color-border);
    }
    .nj-btn-danger {
      background: var(--color-danger);
      color: #fff;
    }
    .nj-btn-spinner {
      width: 1em;
      height: 1em;
      border: 2px solid currentColor;
      border-right-color: transparent;
      border-radius: var(--radius-full);
      animation: nj-spin 0.7s linear infinite;
    }
    @keyframes nj-spin {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .nj-btn-spinner {
        animation-duration: 2s;
      }
    }
  `,
})
export class NjButton {
  readonly variant = input<NjButtonVariant>('primary');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly pending = input(false);
  readonly disabled = input(false);
}
