import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService, safeReturnUrl } from '../core/auth/auth.service';
import { SeoService } from '../seo.service';

/**
 * /sign-in: sends the browser to the NextJedi Identity login page (email code or Google).
 * Already signed in: goes straight back to the return URL.
 */
@Component({
  selector: 'app-sign-in',
  imports: [RouterLink],
  template: `
    <main class="auth-page">
      <div class="auth-card">
        <a class="auth-brand" routerLink="/">
          <span class="material-symbols-outlined">grid_view</span> Next Jedi
        </a>
        @if (failed()) {
          <h1 class="auth-title">We couldn't reach the sign-in page</h1>
          <p class="auth-sub">Check your connection and try again.</p>
          <button type="button" class="auth-btn" (click)="go()">Try again</button>
        } @else {
          <span class="material-symbols-outlined auth-spin" aria-hidden="true"
            >progress_activity</span
          >
          <h1 class="auth-title">Taking you to sign in…</h1>
          <p class="auth-sub">
            Sign in with an email code or Google. One NextJedi account works for every app.
          </p>
          <button type="button" class="auth-link" (click)="go()">Not moving? Continue</button>
        }
      </div>
    </main>
  `,
  styleUrl: './auth-pages.css',
})
export class SignInPage implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private seo = inject(SeoService);

  protected readonly failed = signal(false);
  private returnUrl = safeReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl'));

  async ngOnInit(): Promise<void> {
    this.seo.set({
      title: 'Sign in',
      description: 'Sign in to your NextJedi account.',
      path: '/sign-in',
    });
    await this.auth.init();
    if (this.auth.isAuthenticated()) {
      void this.router.navigateByUrl(this.returnUrl);
      return;
    }
    this.go();
  }

  protected go(): void {
    this.failed.set(false);
    try {
      this.auth.signIn(this.returnUrl);
    } catch {
      this.failed.set(true);
    }
  }
}
