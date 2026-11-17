import { ChangeDetectionStrategy, Component, ElementRef, effect, input, output, viewChild } from '@angular/core';

/** Modal built on the native <dialog>: showModal() gives the focus trap and Esc handling. */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nj-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dlg class="nj-dialog" [attr.aria-label]="label()" (close)="closed.emit()" (click)="onBackdrop($event)">
      <div class="nj-dialog-body">
        <ng-content />
      </div>
    </dialog>
  `,
  styles: `
    .nj-dialog {
      margin: auto;
      padding: 0;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      background: var(--color-surface);
      color: var(--color-text);
      box-shadow: var(--shadow-lg);
      font-family: var(--font-body);
      width: min(480px, calc(100vw - 32px));
    }
    .nj-dialog::backdrop {
      background: rgba(20, 27, 43, 0.5);
    }
    .nj-dialog-body {
      padding: 24px;
    }
  `,
})
export class NjDialog {
  readonly open = input(false);
  readonly label = input('');
  readonly closed = output<void>();

  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  constructor() {
    effect(() => {
      const el = this.dlg().nativeElement;
      if (this.open() && !el.open) el.showModal();
      else if (!this.open() && el.open) el.close();
    });
  }

  protected onBackdrop(event: MouseEvent): void {
    if (event.target === this.dlg().nativeElement) this.dlg().nativeElement.close();
  }
}
