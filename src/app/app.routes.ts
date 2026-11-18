import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AppPage } from './shared/app-page/app-page';
import { SharedPrivacyPolicy } from './shared/privacy-policy/privacy-policy';
import { SharedSupport } from './shared/support/support';
import { SharedMarketing } from './shared/marketing/marketing';
import { SharedLegal } from './shared/legal/legal';
import { SharedDeleteAccount } from './shared/delete-account/delete-account';
import { AuroraPage } from './aurora/aurora';
import { TeamPage } from './team/team';
import { MindfulTennisPage } from './mindful-tennis/mindful-tennis';
import { APPS } from './apps.config';
import { authGuard } from './core/auth/auth.guard';

function appRoutes(slug: string): Routes {
  return [
    { path: slug, component: AppPage, data: { appSlug: slug } },
    { path: `${slug}/privacy-policy`, component: SharedPrivacyPolicy, data: { appSlug: slug } },
    { path: `${slug}/support`, component: SharedSupport, data: { appSlug: slug } },
    { path: `${slug}/marketing`, component: SharedMarketing, data: { appSlug: slug } },
  ];
}

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'aurora', component: AuroraPage },
  { path: 'team', component: TeamPage },

  // Ideas and founder spots (NJACC-62), sign-in and account (NJACC-63). Data from platform-api.
  // Lazy, so the home page does not pay for them.
  { path: 'ideas', loadComponent: () => import('./ideas/ideas').then((m) => m.IdeasPage) },
  {
    path: 'ideas/:slug',
    loadComponent: () => import('./ideas/idea-detail').then((m) => m.IdeaDetailPage),
  },
  { path: 'sign-in', loadComponent: () => import('./auth/sign-in').then((m) => m.SignInPage) },
  {
    path: 'auth/callback',
    loadComponent: () => import('./auth/auth-callback').then((m) => m.AuthCallbackPage),
  },
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () => import('./account/account').then((m) => m.AccountPage),
  },

  // Company privacy policy (NEX-1810): website + internal social publishing tool.
  // Linked from LinkedIn, Google (YouTube API) and Meta app settings. Apps keep their own policies.
  { path: 'privacy', component: SharedLegal, data: { legalDoc: 'privacy' } },
  { path: 'privacy-policy', redirectTo: 'privacy', pathMatch: 'full' },

  // Business-level legal pages (required for Razorpay KYC — present on every domain)
  { path: 'terms', component: SharedLegal, data: { legalDoc: 'terms' } },
  { path: 'refund', component: SharedLegal, data: { legalDoc: 'refund' } },
  { path: 'shipping', component: SharedLegal, data: { legalDoc: 'shipping' } },
  { path: 'contact', component: SharedLegal, data: { legalDoc: 'contact' } },

  // Mindful Tennis — custom rich page
  { path: 'mindful-tennis', component: MindfulTennisPage, data: { appSlug: 'mindful-tennis' } },
  { path: 'mindful-tennis/privacy-policy', component: SharedPrivacyPolicy, data: { appSlug: 'mindful-tennis' } },
  { path: 'mindful-tennis/support', component: SharedSupport, data: { appSlug: 'mindful-tennis' } },
  { path: 'mindful-tennis/marketing', component: SharedMarketing, data: { appSlug: 'mindful-tennis' } },

  // Mindful Journal — store listings point at /privacy and /delete-account (Play requires a
  // web deletion URL). /privacy-policy stays as an alias so the shared footer link still works.
  { path: 'mindful-journal/privacy', component: SharedPrivacyPolicy, data: { appSlug: 'mindful-journal', canonicalPath: '/mindful-journal/privacy' } },
  { path: 'mindful-journal/privacy-policy', redirectTo: 'mindful-journal/privacy', pathMatch: 'full' },
  { path: 'mindful-journal/delete-account', component: SharedDeleteAccount, data: { appSlug: 'mindful-journal' } },

  // Karagre — store listings point at /privacy (NEX-624). /privacy-policy stays as an alias.
  { path: 'karagre/privacy', component: SharedPrivacyPolicy, data: { appSlug: 'karagre', canonicalPath: '/karagre/privacy' } },
  { path: 'karagre/privacy-policy', redirectTo: 'karagre/privacy', pathMatch: 'full' },

  // All other apps use the generic AppPage template
  ...APPS.filter(app => app.slug !== 'mindful-tennis').flatMap(app => appRoutes(app.slug)),
];
