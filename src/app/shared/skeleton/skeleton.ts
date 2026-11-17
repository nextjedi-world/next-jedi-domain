import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Shimmer placeholder. Repeat it (e.g. with @for) to build list skeletons. */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'nj-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'nj-skeleton',
    'aria-hidden': 'true',
    '[class.nj-skeleton-circle]': 'circle()',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
  },
  template: '',
  styles: `
    :host {
      display: block;
      background: linear-gradient(
        90deg,
        var(--color-surface-high) 25%,
        var(--color-surface-low) 50%,
        var(--color-surface-high) 75%
      );
      background-size: 200% 100%;
      border-radius: var(--radius-xs);
      animation: nj-shimmer 1.4s ease-in-out infinite;
    }
    :host(.nj-skeleton-circle) {
      border-radius: var(--radius-full);
    }
    @keyframes nj-shimmer {
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      :host {
        animation: none;
      }
    }
  `,
})
export class NjSkeleton {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly circle = input(false);
}
