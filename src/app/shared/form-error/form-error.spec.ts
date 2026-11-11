import { TestBed } from '@angular/core/testing';
import { BUSINESS } from '../content/legal.content';
import { FormErrorComponent } from './form-error';

describe('FormErrorComponent', () => {
  it('shows an alert with a mailto fallback and emits retry', () => {
    const fixture = TestBed.createComponent(FormErrorComponent);
    fixture.componentRef.setInput('subject', 'Support request');
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('[role="alert"]')).not.toBeNull();
    const href = el.querySelector('a')!.getAttribute('href')!;
    expect(href).toBe(`mailto:${BUSINESS.email}?subject=Support%20request`);

    let retried = 0;
    fixture.componentInstance.retry.subscribe(() => retried++);
    el.querySelector('button')!.click();
    expect(retried).toBe(1);
  });
});
