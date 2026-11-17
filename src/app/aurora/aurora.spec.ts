import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { PlatformApi } from '../core/platform-api';
import { FakeAuthService } from '../core/testing';
import { AuroraPage } from './aurora';

function setup(submit: () => Observable<unknown> = () => of({ id: '1', status: 'received' })) {
  const api = { submit: vi.fn(submit) };
  TestBed.configureTestingModule({
    imports: [AuroraPage],
    providers: [
      provideRouter([]),
      { provide: AuthService, useValue: new FakeAuthService() },
      { provide: PlatformApi, useValue: api },
    ],
  });
  const fixture = TestBed.createComponent(AuroraPage);
  fixture.detectChanges();
  return { fixture, cmp: fixture.componentInstance, api };
}

function type(el: HTMLElement, selector: string, value: string) {
  const input = el.querySelector(selector) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

function fillStep1(cmp: AuroraPage) {
  cmp.waitlistForm.patchValue({ name: 'Ada', email: 'ada@example.com' });
}

describe('Aurora waitlist steps', () => {
  it('blocks step 1 until email and name are valid', () => {
    const { cmp } = setup();
    cmp.nextStep();
    expect(cmp.step()).toBe(1);
    cmp.waitlistForm.patchValue({ name: 'Ada', email: 'bad' });
    cmp.nextStep();
    expect(cmp.step()).toBe(1);
    fillStep1(cmp);
    cmp.nextStep();
    expect(cmp.step()).toBe(2);
  });

  it('requires an interest on step 2 and announces step changes', () => {
    const { cmp } = setup();
    fillStep1(cmp);
    cmp.nextStep();
    cmp.nextStep();
    expect(cmp.step()).toBe(2);
    expect(cmp.interestsError()).toBe(true);
    cmp.toggleInterest('Games and puzzles');
    expect(cmp.interestsError()).toBe(false);
    cmp.nextStep();
    expect(cmp.step()).toBe(3);
    expect(cmp.announcement()).toBe('Step 3 of 3: Feature request');
  });

  it('keeps state when going back', () => {
    const { cmp } = setup();
    fillStep1(cmp);
    cmp.nextStep();
    cmp.toggleInterest('Developer tools');
    cmp.nextStep();
    cmp.prevStep();
    cmp.prevStep();
    expect(cmp.step()).toBe(1);
    expect(cmp.wEmail.value).toBe('ada@example.com');
    expect(cmp.interests()).toEqual(['Developer tools']);
  });

  it('submits once at the end with the interests and feature in the message, then resets', () => {
    const { fixture, cmp, api } = setup();
    fillStep1(cmp);
    cmp.nextStep();
    cmp.toggleInterest('Developer tools');
    cmp.nextStep();
    cmp.waitlistForm.patchValue({ feature: 'Dark mode' });
    cmp.onJoinWaitlist();
    fixture.detectChanges();
    expect(api.submit).toHaveBeenCalledTimes(1);
    expect(api.submit).toHaveBeenCalledWith({
      kind: 'waitlist',
      name: 'Ada',
      email: 'ada@example.com',
      website: '',
      message: 'Interested in: Developer tools\n\nDark mode',
    });
    expect(fixture.nativeElement.textContent).toContain("You're in");
    expect(cmp.step()).toBe(1);
  });

  it('keeps partial state and offers retry and mailto when the save fails', () => {
    const { fixture, cmp, api } = setup(() => throwError(() => new HttpErrorResponse({ status: 500 })));
    fillStep1(cmp);
    cmp.nextStep();
    cmp.toggleInterest('Developer tools');
    cmp.nextStep();
    cmp.onJoinWaitlist();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).not.toContain("You're in");
    expect(el.querySelector('app-form-error a')!.getAttribute('href')).toContain('mailto:');
    expect(cmp.step()).toBe(3);
    expect(cmp.wEmail.value).toBe('ada@example.com');
    expect(cmp.interests()).toEqual(['Developer tools']);
    (el.querySelector('app-form-error button') as HTMLButtonElement).click();
    expect(api.submit).toHaveBeenCalledTimes(2);
  });

  it('goes back to step 1 when the server rejects the email', () => {
    const { fixture, cmp } = setup(() =>
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { error: 'validation', fields: { email: 'invalid_email' } },
          }),
      ),
    );
    fillStep1(cmp);
    cmp.nextStep();
    cmp.toggleInterest('Developer tools');
    cmp.nextStep();
    cmp.onJoinWaitlist();
    fixture.detectChanges();
    expect(cmp.step()).toBe(1);
    expect(cmp.wEmail.hasError('server')).toBe(true);
  });
});

describe('Aurora idea form', () => {
  it('posts the idea anonymously with the honeypot, and shows success', () => {
    const { fixture, api } = setup();
    const el: HTMLElement = fixture.nativeElement;
    type(el, '#idea-description', 'An app that plans my week');
    (el.querySelector('form.request-form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(api.submit).toHaveBeenCalledWith(
      { kind: 'idea', message: 'An app that plans my week', website: '' },
      { anonymous: true },
    );
    expect(el.textContent).toContain('Idea submitted!');
  });

  it('shows the error with retry and mailto when the save fails, and not success', () => {
    const { fixture, api } = setup(() => throwError(() => new HttpErrorResponse({ status: 500 })));
    const el: HTMLElement = fixture.nativeElement;
    type(el, '#idea-description', 'An app that plans my week');
    (el.querySelector('form.request-form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(el.textContent).not.toContain('Idea submitted!');
    expect(el.querySelector('.request-card app-form-error a')!.getAttribute('href')).toContain('mailto:');
    (el.querySelector('.request-card app-form-error button') as HTMLButtonElement).click();
    expect(api.submit).toHaveBeenCalledTimes(2);
  });
});

describe('Aurora accessibility', () => {
  it('labels the idea textarea and the step 1 inputs', () => {
    const el: HTMLElement = setup().fixture.nativeElement;
    expect(el.querySelector('#idea-description')).toBeTruthy();
    expect(el.querySelector('label[for="idea-description"]')).toBeTruthy();
    expect(el.querySelector('label[for="wl-name"]')).toBeTruthy();
    expect(el.querySelector('label[for="wl-email"]')).toBeTruthy();
  });

  it('links invalid fields to their error message', () => {
    const { fixture, cmp } = setup();
    cmp.nextStep();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('#wl-name')?.getAttribute('aria-describedby')).toBe('wl-name-error');
    expect(el.querySelector('#wl-name-error')?.getAttribute('role')).toBe('alert');
  });

  it('hides decorative icons from assistive tech', () => {
    const el: HTMLElement = setup().fixture.nativeElement;
    const icons = el.querySelectorAll('.material-symbols-outlined');
    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((i) => expect(i.getAttribute('aria-hidden')).toBe('true'));
  });
});
