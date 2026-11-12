import { Component, computed, input } from '@angular/core';
import { ProductStatus } from '../core/platform-api.models';

export const STATUS_LABELS: Record<ProductStatus, string> = {
  live: 'Live',
  beta: 'Beta',
  building: 'Building',
  idea: 'Idea',
};

/** Pill showing where a product is: Live, Beta, Building or Idea. */
@Component({
  selector: 'app-status-badge',
  template: `<span class="status" [class]="'status-' + status()">
    <span class="dot" aria-hidden="true"></span>{{ label() }}
  </span>`,
  styles: [
    `
      .status {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: var(--radius-full);
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        white-space: nowrap;
      }
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
      }
      .status-live {
        background: #dcfce7;
        color: #166534;
      }
      .status-beta {
        background: #fef3c7;
        color: #92400e;
      }
      .status-building {
        background: var(--color-primary-light);
        color: var(--color-primary);
      }
      .status-idea {
        background: #f3e8ff;
        color: #6b21a8;
      }
    `,
  ],
})
export class StatusBadgeComponent {
  readonly status = input.required<ProductStatus>();
  protected readonly label = computed(() => STATUS_LABELS[this.status()] ?? this.status());
}
