import { TestBed } from '@angular/core/testing';
import { SubmitState } from '../../core/submission';
import { BUSINESS } from '../content/legal.content';
import { FormErrorComponent } from './form-error';

function render(state: SubmitState, otherErrors: string[] = []) {
  const fixture = TestBed.createComponent(FormErrorComponent);
  fixture.componentRef.setInput('state', state);
  fixture.componentRef.setInput('subject', 'Support request');
  fixture.componentRef.setInput('otherErrors', otherErrors);
  fixture.detectChanges();
  return fixture;
}

describe('FormErrorComponent', () => {
  it('shows an alert with a mailto fallback and emits retry when the save failed', () => {
    const fixture = render('error');
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('[role="alert"]')).not.toBeNull();
    const href = el.querySelector('a')!.getAttribute('href')!;
    expect(href).toBe(`mailto:${BUSINESS.email}?subject=Support%20request`);

    let retried = 0;
    fixture.componentInstance.retry.subscribe(() => retried++);
    el.querySelector('button')!.click();
    expect(retried).toBe(1);
  });

  it('asks the person to wait when rate limited, with the mailto fallback and no retry button', () => {
    const el: HTMLElement = render('rate_limited').nativeElement;
    expect(el.querySelector('[role="alert"]')).not.toBeNull();
    expect(el.querySelector('a')!.getAttribute('href')).toContain('mailto:');
    expect(el.querySelector('button')).toBeNull();
  });

  it('lists server errors that have no input when the fields were rejected', () => {
    const el: HTMLElement = render('invalid', ['product: Unknown product.']).nativeElement;
    expect(el.textContent).toContain('Please check the highlighted fields');
    expect(el.textContent).toContain('product: Unknown product.');
  });

  it('shows nothing while idle, submitting or after success', () => {
    for (const state of ['idle', 'submitting', 'success'] as const) {
      const el: HTMLElement = render(state).nativeElement;
      expect(el.querySelector('[role="alert"]')).toBeNull();
    }
  });
});
