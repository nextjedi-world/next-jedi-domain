import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { MOCK_SUBMISSIONS, mockProducts } from '../core/mock/mock-data';
import { PlatformApi } from '../core/platform-api';
import { FakeAuthService, TEST_USER } from '../core/testing';
import { AccountPage } from './account';

describe('AccountPage', () => {
  let auth: FakeAuthService;
  let api: Record<string, ReturnType<typeof vi.fn>>;

  function render() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: PlatformApi, useValue: api },
      ],
    });
    const fixture = TestBed.createComponent(AccountPage);
    fixture.detectChanges();
    return fixture;
  }

  beforeEach(() => {
    auth = new FakeAuthService();
    auth.userSig.set(TEST_USER);
    api = {
      catalog: vi.fn(() => of({ workspace: 'nextjedi', products: mockProducts() })),
      myEntitlements: vi.fn((product: string) =>
        of({
          product,
          entitlements:
            product === 'karagre'
              ? [{ key: 'founder', active: true, source: 'manual', expiresAt: null }]
              : [],
        }),
      ),
      mySubmissions: vi.fn(() => of({ submissions: MOCK_SUBMISSIONS })),
    };
  });

  it('shows the profile, entitlements and submissions', () => {
    const el: HTMLElement = render().nativeElement;
    expect(el.textContent).toContain('Asha Rao');
    expect(el.textContent).toContain('asha@example.com');
    expect(api['myEntitlements']).toHaveBeenCalledTimes(mockProducts().length);
    expect(el.textContent).toContain('founder');
    expect(el.textContent).toContain('Founder spot reserved');
    expect(el.textContent).toContain('Karagre');
    expect(el.querySelectorAll('section.card')[2].querySelectorAll('li.row').length).toBe(3);
  });

  it('shows an error with retry when submissions fail to load', () => {
    api['mySubmissions'].mockReturnValue(throwError(() => new Error('x')));
    const el: HTMLElement = render().nativeElement;
    expect(el.textContent).toContain("We couldn't load your messages.");
  });

  it('signs out', () => {
    const el: HTMLElement = render().nativeElement;
    (el.querySelector('.btn-outline') as HTMLButtonElement).click();
    expect(auth.signOut).toHaveBeenCalled();
  });
});
