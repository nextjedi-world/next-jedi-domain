import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="app-footer">
      <div class="footer-inner">
        <div class="footer-brand-row">
          <a class="footer-brand" routerLink="/">
            <span class="material-symbols-outlined footer-brand-icon" aria-hidden="true">grid_view</span>
            <span class="footer-brand-name">Next Jedi</span>
          </a>
          @if (appName()) {
            <span class="footer-sep">·</span>
            <span class="footer-app-name">{{ appName() }}</span>
          }
        </div>
        <nav class="footer-links">
          @if (appSlug()) {
            <a class="footer-link" [routerLink]="'/' + appSlug() + '/privacy-policy'">Privacy Policy</a>
            <a class="footer-link" [routerLink]="'/' + appSlug() + '/support'">Support</a>
          }
          <a class="footer-link" routerLink="/privacy">{{ appSlug() ? 'Company Privacy' : 'Privacy Policy' }}</a>
          <a class="footer-link" routerLink="/terms">Terms &amp; Conditions</a>
          <a class="footer-link" routerLink="/refund">Refund Policy</a>
          <a class="footer-link" routerLink="/shipping">Shipping</a>
          <a class="footer-link" routerLink="/contact">Contact</a>
          <a class="footer-link" routerLink="/aurora">Project Aurora</a>
          <a class="footer-link" routerLink="/team">Meet the Team</a>
        </nav>
        <p class="footer-copy">© 2026 Next Jedi. All rights reserved.</p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  appName = input<string>();
  appSlug = input<string>();
}
