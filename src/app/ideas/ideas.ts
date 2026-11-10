import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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

  protected load(): void {
    this.state.set('loading');
    this.api.catalog().subscribe({
      next: (res) => {
        this.products.set(res.products ?? []);
        this.state.set('ready');
      },
      error: () => this.state.set('error'),
    });
  }
}
