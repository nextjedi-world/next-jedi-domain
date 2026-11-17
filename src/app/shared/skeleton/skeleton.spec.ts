import { TestBed } from '@angular/core/testing';
import { NjSkeleton } from './skeleton';

describe('NjSkeleton', () => {
  it('is hidden from assistive tech and uses default size', () => {
    const fixture = TestBed.createComponent(NjSkeleton);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.style.width).toBe('100%');
    expect(el.style.height).toBe('1rem');
  });

  it('applies custom size and circle shape', () => {
    const fixture = TestBed.createComponent(NjSkeleton);
    fixture.componentRef.setInput('width', '40px');
    fixture.componentRef.setInput('height', '40px');
    fixture.componentRef.setInput('circle', true);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.style.width).toBe('40px');
    expect(el.classList.contains('nj-skeleton-circle')).toBe(true);
  });
});
