import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

let nextFieldId = 0;

/**
 * Label + control + hint + error. Wire the projected control through the exported instance:
 * `<nj-field #f="njField" label="Email"><input [id]="f.controlId" [attr.aria-describedby]="f.describedBy()" /></nj-field>`
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nj-field',
  exportAs: 'njField',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="nj-field" [class.nj-field-invalid]="!!error()">
      <label class="nj-field-label" [attr.for]="controlId">
        {{ label() }}
        @if (required()) {
          <span aria-hidden="true">*</span>
        }
      </label>
      <ng-content />
      @if (hint() && !error()) {
        <p class="nj-field-hint" [id]="hintId">{{ hint() }}</p>
      }
      @if (error()) {
        <p class="nj-field-error" [id]="errorId" role="alert">{{ error() }}</p>
      }
    </div>
  `,
  styles: `
    .nj-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-family: var(--font-body);
    }
    .nj-field-label {
      font-family: var(--font-headline);
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--color-text);
    }
    .nj-field-hint {
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }
    .nj-field-error {
      font-size: 0.8rem;
      color: var(--color-danger);
    }
    :host ::ng-deep input,
    :host ::ng-deep select,
    :host ::ng-deep textarea {
      font: inherit;
      padding: 10px 12px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-text);
    }
    :host ::ng-deep input:focus-visible,
    :host ::ng-deep select:focus-visible,
    :host ::ng-deep textarea:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 1px;
    }
    :host ::ng-deep .nj-field-invalid input,
    :host ::ng-deep .nj-field-invalid select,
    :host ::ng-deep .nj-field-invalid textarea {
      border-color: var(--color-danger);
    }
  `,
})
export class NjField {
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly error = input('');
  readonly required = input(false);

  readonly controlId = `nj-field-${nextFieldId++}`;
  readonly hintId = `${this.controlId}-hint`;
  readonly errorId = `${this.controlId}-error`;

  /** Value for the control's aria-describedby. */
  readonly describedBy = computed(() => (this.error() ? this.errorId : this.hint() ? this.hintId : null));
}
