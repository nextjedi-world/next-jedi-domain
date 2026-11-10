import { Component, ElementRef, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, initials } from '../../core/auth/auth.service';

/** Header avatar with a small menu when signed in; a "Sign in" link when not. */
@Component({
  selector: 'app-user-menu',
  imports: [RouterLink],
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'open.set(false)',
  },
  template: `
    @if (auth.ready()) {
      @if (auth.user(); as user) {
        <button
          type="button"
          class="avatar-btn"
          [attr.aria-expanded]="open()"
          aria-haspopup="menu"
          [attr.aria-label]="'Account menu for ' + (user.name || user.email)"
          (click)="open.set(!open())"
        >
          @if (user.picture) {
            <img class="avatar-img" [src]="user.picture" alt="" />
          } @else {
            <span class="avatar-initials">{{ initials() }}</span>
          }
        </button>
        @if (open()) {
          <div class="menu" role="menu">
            <div class="menu-head">
              <span class="menu-name">{{ user.name || 'Signed in' }}</span>
              <span class="menu-email">{{ user.email }}</span>
            </div>
            <a class="menu-item" role="menuitem" routerLink="/account" (click)="open.set(false)">
              <span class="material-symbols-outlined">person</span> Account
            </a>
            <a class="menu-item" role="menuitem" routerLink="/ideas" (click)="open.set(false)">
              <span class="material-symbols-outlined">lightbulb</span> Ideas
            </a>
            <button type="button" class="menu-item" role="menuitem" (click)="signOut()">
              <span class="material-symbols-outlined">logout</span> Sign out
            </button>
          </div>
        }
      } @else {
        <a class="sign-in-link" routerLink="/sign-in" [queryParams]="{ returnUrl: router.url }">
          Sign in
        </a>
      }
    }
  `,
  styles: [
    `
      :host {
        position: relative;
        display: flex;
        align-items: center;
        flex-shrink: 0;
      }
      @media (max-width: 640px) {
        :host {
          margin-left: auto;
        }
      }
      .avatar-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 2px solid var(--color-primary-light);
        background: var(--color-primary);
        color: #fff;
        cursor: pointer;
        padding: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .avatar-btn:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .avatar-initials {
        font-family: var(--font-headline);
        font-weight: 800;
        font-size: 0.8rem;
        letter-spacing: 0.02em;
      }
      .sign-in-link {
        font-size: 0.875rem;
        font-weight: 700;
        color: var(--color-primary);
        padding: 8px 16px;
        border-radius: var(--radius-full);
        background: var(--color-primary-light);
        white-space: nowrap;
      }
      .sign-in-link:hover {
        opacity: 0.85;
      }
      .menu {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        min-width: 220px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        padding: 8px;
        z-index: 200;
        display: flex;
        flex-direction: column;
      }
      .menu-head {
        display: flex;
        flex-direction: column;
        padding: 8px 10px 10px;
        border-bottom: 1px solid var(--color-border);
        margin-bottom: 6px;
      }
      .menu-name {
        font-weight: 700;
        font-size: 0.9rem;
        color: var(--color-text);
      }
      .menu-email {
        font-size: 0.8rem;
        color: var(--color-text-light);
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 9px 10px;
        border-radius: var(--radius-xs);
        font: inherit;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-muted);
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
      }
      .menu-item:hover {
        background: var(--color-surface-low);
        color: var(--color-primary);
      }
      .menu-item .material-symbols-outlined {
        font-size: 18px;
      }
    `,
  ],
})
export class UserMenuComponent {
  protected auth = inject(AuthService);
  protected router = inject(Router);
  private host = inject(ElementRef<HTMLElement>);

  protected readonly open = signal(false);
  protected readonly initials = computed(() => initials(this.auth.user()));

  protected onDocumentClick(event: Event): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  protected signOut(): void {
    this.open.set(false);
    this.auth.signOut();
  }
}
