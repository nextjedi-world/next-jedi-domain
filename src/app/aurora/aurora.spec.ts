import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { PlatformApi } from '../core/platform-api';
import { FakeAuthService } from '../core/testing';
import { AuroraPage } from './aurora';

describe('AuroraPage forms', () => {
  let submit: ReturnType<typeof vi.fn>;

  function render() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: new FakeAuthService() },
        { provide: PlatformApi, useValue: { submit } },
      ],
    });
    const fixture = TestBed.createComponent(AuroraPage);
    fixture.detectChanges();
    return fixture;
  }

  function type(el: HTMLElement, selector: string, value: string) {
    const input = el.querySelector(selector) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  beforeEach(() => {
    submit = vi.fn(() => of({ id: '1', status: 'received' }));
  });

  it('posts the idea anonymously with the honeypot, and shows success', () => {
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    type(el, '#ai-description', 'An app that plans my week');
    (el.querySelector('form.request-form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(submit).toHaveBeenCalledWith(
      { kind: 'idea', message: 'An app that plans my week', website: '' },
      { anonymous: true },
    );
    expect(el.textContent).toContain('Idea submitted!');
  });

  it('shows the error with retry and mailto when the save fails, and not success', () => {
    submit.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    type(el, '#ai-description', 'An app that plans my week');
    (el.querySelector('form.request-form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(el.textContent).not.toContain('Idea submitted!');
    expect(el.querySelector('app-form-error a')!.getAttribute('href')).toContain('mailto:');
    (el.querySelector('app-form-error button') as HTMLButtonElement).click();
    expect(submit).toHaveBeenCalledTimes(2);
  });

  it('joins the waitlist with name, email and the feature as the message', () => {
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    type(el, '#aw-name', 'Ravi');
    type(el, '#aw-email', 'ravi@example.com');
    type(el, '#aw-feature', 'Dark mode');
    (el.querySelector('form.access-form') as HTMLFormElement).dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    expect(submit).toHaveBeenCalledWith({
      kind: 'waitlist',
      name: 'Ravi',
      email: 'ravi@example.com',
      website: '',
      message: 'Dark mode',
    });
    expect(el.textContent).toContain("You're in");
  });
});
