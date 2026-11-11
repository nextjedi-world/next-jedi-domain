import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

export interface WaitlistData {
  name: string;
  email: string;
  app?: string;
  platform?: string;
  feature: string;
}

export interface IdeaData {
  description: string;
}

export interface SupportData {
  name: string;
  email: string;
  app: string;
  message: string;
}

/** Thrown when a form could not be saved (network, HTTP, or `ok !== true`). */
export class SubmitError extends Error {
  constructor(message: string, override readonly cause?: unknown) {
    super(message);
    this.name = 'SubmitError';
  }
}

const REQUEST_TIMEOUT_MS = 20000;

@Injectable({ providedIn: 'root' })
export class AuroraService {
  // Google Apps Script web app. Redeploying as a new version of the same deployment keeps this URL.
  private readonly SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxa2zlgCIqwQD7GoEsLF08qJYXCdIZmTFfBc8jOwVMx4CkiJhZmddP2-ts--HRSaLsUDQ/exec';

  submitWaitlist(data: WaitlistData): Observable<void> {
    return this.post('waitlist', data);
  }

  submitIdea(data: IdeaData): Observable<void> {
    return this.post('idea', data);
  }

  submitSupport(data: SupportData): Observable<void> {
    return this.post('support', data);
  }

  /**
   * POST as text/plain: a CORS "simple request" (no preflight), which Apps Script web apps
   * require. The script answers with JSON, which is readable cross-origin, so the real result
   * is checked instead of assumed.
   */
  private post(type: string, data: object): Observable<void> {
    return from(this.send(type, data));
  }

  private async send(type: string, data: object): Promise<void> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      let res: Response;
      try {
        res = await fetch(this.SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ type, ...data }),
          signal: controller.signal,
        });
      } catch (err) {
        throw new SubmitError('Network error', err);
      }
      if (!res.ok) throw new SubmitError(`HTTP ${res.status}`);
      let body: { ok?: unknown; error?: unknown };
      try {
        body = await res.json();
      } catch (err) {
        throw new SubmitError('Unreadable response', err);
      }
      if (body?.ok !== true) {
        throw new SubmitError(typeof body?.error === 'string' ? body.error : 'Save failed');
      }
    } finally {
      clearTimeout(timer);
    }
  }
}
