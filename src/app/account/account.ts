import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { AuthService, initials } from '../core/auth/auth.service';
import { PlatformApi } from '../core/platform-api';
import {
  CatalogProduct,
  Entitlement,
  MySubmission,
  SubmissionKind,
} from '../core/platform-api.models';
import { SeoService } from '../seo.service';
import { FooterComponent } from '../shared/footer/footer';
import { SiteHeaderComponent } from '../shared/site-header/site-header';

export const KIND_LABELS: Record<SubmissionKind, string> = {
  early_adopter: 'Founder spot reserved',
  waitlist: 'Joined the waitlist',
  tester: 'Asked to be a tester',
  support: 'Support message',
  idea: 'Idea sent',
};

interface ProductEntitlements {
  product: CatalogProduct;
  entitlements: Entitlement[];
}

type Load<T> = { state: 'loading' } | { state: 'error' } | { state: 'ready'; data: T };

/** /account (signed in only): who you are, what you own, and what you've sent us. */
@Component({
  selector: 'app-account',
  imports: [DatePipe, RouterLink, FooterComponent, SiteHeaderComponent],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class AccountPage implements OnInit {
  protected auth = inject(AuthService);
  private api = inject(PlatformApi);
  private seo = inject(SeoService);

  protected readonly initials = computed(() => initials(this.auth.user()));
  protected readonly submissions = signal<Load<MySubmission[]>>({ state: 'loading' });
  protected readonly owned = signal<Load<ProductEntitlements[]>>({ state: 'loading' });
  private readonly names = signal<Record<string, string>>({});
  protected readonly kindLabels = KIND_LABELS;
  protected readonly ownedRows = computed(() => {
    const o = this.owned();
    return o.state === 'ready' ? o.data : [];
  });
  protected readonly submissionRows = computed(() => {
    const s = this.submissions();
    return s.state === 'ready' ? s.data : [];
  });

  ngOnInit(): void {
    this.seo.set({
      title: 'Your account',
      description: 'Your NextJedi account, purchases and messages.',
      path: '/account',
    });
    this.loadSubmissions();
    this.loadEntitlements();
  }

  protected productName(id: string | null): string {
    if (!id) return 'Next Jedi';
    return this.names()[id] ?? id;
  }

  protected loadSubmissions(): void {
    this.submissions.set({ state: 'loading' });
    this.api.mySubmissions().subscribe({
      next: (res) => {
        const sorted = [...(res.submissions ?? [])].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        );
        this.submissions.set({ state: 'ready', data: sorted });
      },
      error: () => this.submissions.set({ state: 'error' }),
    });
  }

  /** One entitlements call per catalog product; a product that fails just shows nothing. */
  protected loadEntitlements(): void {
    this.owned.set({ state: 'loading' });
    this.api
      .catalog()
      .pipe(
        switchMap((cat) => {
          this.names.set(Object.fromEntries(cat.products.map((p) => [p.id, p.name])));
          if (!cat.products.length) return of([] as ProductEntitlements[]);
          return forkJoin(
            cat.products.map((product) =>
              this.api.myEntitlements(product.id).pipe(
                map((r) => ({ product, entitlements: r.entitlements.filter((e) => e.active) })),
                catchError(() => of({ product, entitlements: [] as Entitlement[] })),
              ),
            ),
          );
        }),
        map((rows) => rows.filter((r) => r.entitlements.length > 0)),
      )
      .subscribe({
        next: (data) => this.owned.set({ state: 'ready', data }),
        error: () => this.owned.set({ state: 'error' }),
      });
  }

  protected signOut(): void {
    this.auth.signOut();
  }
}
