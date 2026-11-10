import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PlatformApi } from '../core/platform-api';
import { CatalogProduct } from '../core/platform-api.models';
import { SeoService } from '../seo.service';
import { FooterComponent } from '../shared/footer/footer';
import { SiteHeaderComponent } from '../shared/site-header/site-header';
import { EarlyAdopterCardComponent } from './early-adopter-card';
import { PLATFORM_LABELS } from './ideas';
import { STATUS_LABELS, StatusBadgeComponent } from './status-badge';

/** /ideas/:slug: one product, with its early-adopter card. */
@Component({
  selector: 'app-idea-detail',
  imports: [
    RouterLink,
    FooterComponent,
    SiteHeaderComponent,
    StatusBadgeComponent,
    EarlyAdopterCardComponent,
  ],
  templateUrl: './idea-detail.html',
  styleUrl: './idea-detail.css',
})
export class IdeaDetailPage implements OnInit {
  private api = inject(PlatformApi);
  private seo = inject(SeoService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  protected readonly state = signal<'loading' | 'ready' | 'not_found' | 'error'>('loading');
  protected readonly product = signal<CatalogProduct | null>(null);
  protected readonly platformLabels = PLATFORM_LABELS;
  protected slug = '';

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.slug = params.get('slug') ?? '';
      this.product.set(null);
      this.load();
    });
  }

  protected load(quiet = false): void {
    if (!quiet) this.state.set('loading');
    this.api.product(this.slug).subscribe({
      next: (p) => {
        this.product.set(p);
        this.state.set('ready');
        this.setSeo(p);
      },
      error: (err: unknown) => {
        if (quiet && this.product()) return;
        const notFound = err instanceof HttpErrorResponse && err.status === 404;
        this.state.set(notFound ? 'not_found' : 'error');
        this.seo.set({
          title: notFound ? 'Idea not found' : 'Ideas',
          description: 'Next Jedi ideas and founder spots.',
          path: `/ideas/${this.slug}`,
        });
      },
    });
  }

  /** After a reservation: refresh the founder count without flashing the loading state. */
  protected onReserved(): void {
    this.load(true);
  }

  private setSeo(p: CatalogProduct): void {
    const status = STATUS_LABELS[p.status] ?? p.status;
    this.seo.set({
      title: p.offer ? `${p.name} — ${p.offer.title} spots` : `${p.name} — ${p.tagline}`,
      description: `${p.tagline} ${p.summary}`.slice(0, 300),
      path: `/ideas/${p.id}`,
      image: p.imageUrl ?? undefined,
      keywords: `${p.name}, ${status}, Next Jedi, early adopter, founder offer`,
    });
  }
}
