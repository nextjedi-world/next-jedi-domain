import { Component, computed, input } from '@angular/core';
import { ProductOffer } from '../core/platform-api.models';

/** "37/100 founders" with a progress bar. */
@Component({
  selector: 'app-offer-progress',
  template: `
    <div class="progress-row">
      <span class="progress-count">
        <strong>{{ claimed() }}/{{ offer().cap }}</strong> {{ noun() }}
      </span>
      @if (full()) {
        <span class="progress-full">All spots taken</span>
      }
    </div>
    <div
      class="bar"
      role="progressbar"
      [attr.aria-valuenow]="claimed()"
      aria-valuemin="0"
      [attr.aria-valuemax]="offer().cap"
      [attr.aria-label]="claimed() + ' of ' + offer().cap + ' ' + noun() + ' spots claimed'"
    >
      <div class="bar-fill" [style.width.%]="percent()"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .progress-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 8px;
        margin-bottom: 6px;
        font-size: 0.82rem;
        color: var(--color-text-muted);
      }
      .progress-count strong {
        color: var(--color-text);
        font-family: var(--font-headline);
        font-weight: 800;
      }
      .progress-full {
        font-size: 0.72rem;
        font-weight: 700;
        color: #92400e;
      }
      .bar {
        height: 8px;
        border-radius: var(--radius-full);
        background: var(--color-surface-high);
        overflow: hidden;
      }
      .bar-fill {
        height: 100%;
        border-radius: inherit;
        background: linear-gradient(90deg, var(--color-primary), #7c3aed);
        transition: width 0.4s ease;
      }
    `,
  ],
})
export class OfferProgressComponent {
  readonly offer = input.required<ProductOffer>();
  protected readonly claimed = computed(() => Math.min(this.offer().claimed, this.offer().cap));
  protected readonly full = computed(() => this.offer().claimed >= this.offer().cap);
  protected readonly percent = computed(() =>
    this.offer().cap > 0 ? Math.round((this.claimed() / this.offer().cap) * 100) : 0,
  );
  /** "Founder" offer -> "founders". */
  protected readonly noun = computed(() => {
    const t = this.offer().title.trim().toLowerCase() || 'spot';
    return t.endsWith('s') ? t : `${t}s`;
  });
}
