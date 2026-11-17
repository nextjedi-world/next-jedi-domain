import { TestBed } from '@angular/core/testing';
import { NjDialog } from './dialog';

describe('NjDialog', () => {
  function setup() {
    const fixture = TestBed.createComponent(NjDialog);
    const dialog: HTMLDialogElement = fixture.nativeElement.querySelector('dialog');
    // jsdom lacks showModal/close; provide minimal stand-ins that mirror native behaviour.
    dialog.showModal = vi.fn(() => dialog.setAttribute('open', ''));
    dialog.close = vi.fn(() => {
      dialog.removeAttribute('open');
      dialog.dispatchEvent(new Event('close'));
    });
    return { fixture, dialog };
  }

  it('calls showModal when open becomes true', async () => {
    const { fixture, dialog } = setup();
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    expect(dialog.showModal).toHaveBeenCalled();
  });

  it('closes when open becomes false', async () => {
    const { fixture, dialog } = setup();
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    fixture.componentRef.setInput('open', false);
    await fixture.whenStable();
    expect(dialog.close).toHaveBeenCalled();
  });

  it('emits closed on the native close event (Esc)', () => {
    const { fixture, dialog } = setup();
    let count = 0;
    fixture.componentInstance.closed.subscribe(() => count++);
    dialog.dispatchEvent(new Event('close'));
    expect(count).toBe(1);
  });

  it('closes on backdrop click', async () => {
    const { fixture, dialog } = setup();
    fixture.componentRef.setInput('open', true);
    await fixture.whenStable();
    dialog.click();
    expect(dialog.close).toHaveBeenCalled();
  });

  it('labels the dialog', () => {
    const { fixture, dialog } = setup();
    fixture.componentRef.setInput('label', 'Confirm');
    fixture.detectChanges();
    expect(dialog.getAttribute('aria-label')).toBe('Confirm');
  });
});
