import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { SeoService } from '../seo.service';

/** /auth/callback: Identity sends the browser back here with the code; we finish sign-in. */
@Component({
  selector: 'app-auth-callback',
  imports: [RouterLink],
  template: `
    <main class="auth-page">
      <div class="auth-card">
        @if (failed()) {
          <h1 class="auth-title">Sign-in didn't finish</h1>
          <p class="auth-sub">The link may have expired, or the sign-in was cancelled.</p>
          <a class="auth-btn" routerLink="/sign-in">Try again</a>
          <a class="auth-link" routerLink="/">Back to home</a>
        } @else {
          <span class="material-symbols-outlined auth-spin" aria-hidden="true"
            >progress_activity</span
          >
          <h1 class="auth-title">Signing you in…</h1>
        }
      </div>
    </main>
  `,
  styleUrl: './auth-pages.css',
})
export class AuthCallbackPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private seo = inject(SeoService);

  protected readonly failed = signal(false);

  async ngOnInit(): Promise<void> {
    this.seo.set({
      title: 'Signing in',
      description: 'Finishing sign-in.',
      path: '/auth/callback',
    });
    const { ok, returnUrl } = await this.auth.completeSignIn();
    if (ok) {
      void this.router.navigateByUrl(returnUrl, { replaceUrl: true });
    } else {
      this.failed.set(true);
    }
  }
}
