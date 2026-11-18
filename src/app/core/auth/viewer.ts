import { computed, effect, inject, untracked } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * Calls `onChange` whenever the signed-in person changes after the first check: sign-in,
 * sign-out, switching accounts, or a stored session that is restored after the page loaded.
 * Not called for the initial state. Must run in an injection context (a constructor); the effect
 * is torn down with that context.
 */
export function onViewerChange(onChange: () => void): void {
  const auth = inject(AuthService);
  // `undefined` until the stored session has been checked, then the user's `sub` or null.
  const viewer = computed(() => (auth.ready() ? (auth.user()?.sub ?? null) : undefined));
  let last: string | null | undefined = untracked(viewer);
  effect(() => {
    const now = viewer();
    if (now === last) return;
    const before = last;
    last = now;
    // Session check finished with nobody signed in: the anonymous first load is already right.
    if (before === undefined && now === null) return;
    untracked(onChange);
  });
}
