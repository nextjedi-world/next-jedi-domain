import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserMenuComponent } from '../user-menu/user-menu';

/** The shared top bar for the newer pages (ideas, account): brand, page name, links, avatar. */
@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive, UserMenuComponent],
  template: `
    <header class="site-nav">
      <div class="nav-inner">
        <a class="nav-brand" routerLink="/">
          <span class="material-symbols-outlined brand-icon">grid_view</span>
          <span class="brand-name">Next Jedi</span>
        </a>
        @if (pageName()) {
          <div class="nav-app">
            <span class="nav-sep">/</span>
            @if (pageLink()) {
              <a class="nav-app-link" [routerLink]="pageLink()">{{ pageName() }}</a>
            } @else {
              <span class="nav-app-name">{{ pageName() }}</span>
            }
          </div>
        }
        <nav class="nav-global-links">
          <a class="nav-global-link" routerLink="/ideas" routerLinkActive="active">Ideas</a>
          <a class="nav-global-link" routerLink="/aurora" routerLinkActive="active">
            Project Aurora
          </a>
          <a class="nav-global-link" routerLink="/team" routerLinkActive="active">Meet the Team</a>
        </nav>
        <app-user-menu />
      </div>
    </header>
  `,
})
export class SiteHeaderComponent {
  readonly pageName = input<string>();
  readonly pageLink = input<string>();
}
