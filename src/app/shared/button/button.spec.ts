import { TestBed } from '@angular/core/testing';
import { NjButton } from './button';

describe('NjButton', () => {
  function setup() {
    const fixture = TestBed.createComponent(NjButton);
    fixture.detectChanges();
    const btn = () => (fixture.nativeElement as HTMLElement).querySelector('button')!;
    return { fixture, btn };
  }

  it('defaults to a primary, type=button, enabled button', () => {
    const { btn } = setup();
    expect(btn().classList.contains('nj-btn-primary')).toBe(true);
    expect(btn().type).toBe('button');
    expect(btn().disabled).toBe(false);
  });

  it('applies the variant class', () => {
    const { fixture, btn } = setup();
    fixture.componentRef.setInput('variant', 'danger');
    fixture.detectChanges();
    expect(btn().classList.contains('nj-btn-danger')).toBe(true);
  });

  it('pending shows a spinner, disables and sets aria-busy', () => {
    const { fixture, btn } = setup();
    fixture.componentRef.setInput('pending', true);
    fixture.detectChanges();
    expect(btn().querySelector('.nj-btn-spinner')).not.toBeNull();
    expect(btn().disabled).toBe(true);
    expect(btn().getAttribute('aria-busy')).toBe('true');
  });

  it('disabled disables without spinner', () => {
    const { fixture, btn } = setup();
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(btn().disabled).toBe(true);
    expect(btn().querySelector('.nj-btn-spinner')).toBeNull();
  });
});
