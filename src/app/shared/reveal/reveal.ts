import { DestroyRef, Directive, ElementRef, inject, signal } from '@angular/core';

/** True when the browser can observe intersections and the user has not asked for reduced motion. */
export function canReveal(win: Pick<Window, 'matchMedia'> & { IntersectionObserver?: unknown }): boolean {
  if (typeof win.IntersectionObserver !== 'function' || typeof win.matchMedia !== 'function') {
    return false;
  }
  return win.matchMedia('(prefers-reduced-motion: no-preference)').matches;
}

/**
 * Fades and lifts an element in the first time it scrolls into view.
 * Does nothing (content stays visible) when reduced motion is requested or
 * IntersectionObserver is unavailable.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[class.nj-reveal]': 'armed()',
    '[class.nj-reveal-in]': 'visible()',
  },
})
export class NjReveal {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  protected readonly armed = signal(false);
  protected readonly visible = signal(false);

  constructor() {
    const win = typeof window === 'undefined' ? undefined : window;
    if (!win || !canReveal(win)) return;
    this.armed.set(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.visible.set(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(this.el.nativeElement);
    inject(DestroyRef).onDestroy(() => observer.disconnect());
  }
}
