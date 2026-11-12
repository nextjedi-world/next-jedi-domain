import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { onViewerChange } from '../core/auth/viewer';
import { PlatformApi } from '../core/platform-api';
import { CatalogProduct } from '../core/platform-api.models';
import { SeoService } from '../seo.service';
import { FooterComponent } from '../shared/footer/footer';
import { SiteHeaderComponent } from '../shared/site-header/site-header';
import { OfferProgressComponent } from './offer-progress';
import { StatusBadgeComponent } from './status-badge';

export const PLATFORM_LABELS: Record<string, string> = {
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
};

/** /ideas: every product in the catalog, from live apps to early ideas. */
@Component({
  selector: 'app-ideas',
  imports: [
    RouterLink,
    FooterComponent,
    SiteHeaderComponent,
    StatusBadgeComponent,
    OfferProgressComponent,
  ],
  templateUrl: './ideas.html',
  styleUrl: './ideas.css',
})
export class IdeasPage implements OnInit {
  private api = inject(PlatformApi);
  private seo = inject(SeoService);

  protected readonly state = signal<'loading' | 'ready' | 'error'>('loading');
  protected readonly products = signal<CatalogProduct[]>([]);
  protected readonly platformLabels = PLATFORM_LABELS;
  private request?: Subscription;

  constructor() {
    // `offer.reserved` depends on who is asking: refresh after sign-in or sign-out.
    onViewerChange(() => this.load(true));
  }

  ngOnInit(): void {
    this.seo.set({
      title: 'Ideas — What Next Jedi is building',
      description:
        'Every Next Jedi app and idea in one place: what is live, in beta, being built or still an idea. Reserve a founder spot on the ones you want.',
      path: '/ideas',
      keywords: 'Next Jedi ideas, upcoming apps, founder offer, early adopter, beta apps',
    });
    this.load();
  }

  /** `quiet` keeps the current list on screen (no skeleton) and keeps it if the reload fails. */
  protected load(quiet = false): void {
    if (!quiet) this.state.set('loading');
    this.request?.unsubscribe();
    this.request = this.api.catalog().subscribe({
      next: (res) => {
        this.products.set(res.products ?? []);
        this.state.set('ready');
      },
      error: () => {
        if (quiet && this.state() === 'ready') return;
        this.state.set('error');
      },
    });
  }
}
