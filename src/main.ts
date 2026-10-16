import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { log } from './app/observability/logger';
import { initSentry } from './app/observability/sentry';

void initSentry();

bootstrapApplication(App, appConfig).catch((err) =>
  log.error('bootstrap failed', { error: String(err) }),
);
