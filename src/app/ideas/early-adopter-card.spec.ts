import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { PlatformApi } from '../core/platform-api';
import { CatalogProduct } from '../core/platform-api.models';
import { FakeAuthService, TEST_USER } from '../core/testing';
import { EarlyAdopterCardComponent } from './early-adopter-card';

const PRODUCT: CatalogProduct = {
  id: 'karagre',
  name: 'Karagre',
  tagline: 'Wake with a verse.',
  summary: '…',
  status: 'building',
  platforms: ['android'],
  url: '/karagre',
  imageUrl: null,
  offer: {
    id: 'karagre-founder',
    kind: 'founder',
    title: 'Founder',
    perks: ['Lifetime access'],
    cap: 100,
    claimed: 37,
    priceInr: null,
    currency: 'INR',
    purchasable: false,
  },
};

describe('EarlyAdopterCardComponent', () => {
  let auth: FakeAuthService;
  let submit: ReturnType<typeof vi.fn>;

  function render(product = PRODUCT) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: PlatformApi, useValue: { submit } },
      ],
    });
    const fixture = TestBed.createComponent(EarlyAdopterCardComponent);
    fixture.componentRef.setInput('product', product);
    fixture.detectChanges();
    return fixture;
  }

  function fill(el: HTMLElement, name: string, email: string) {
    const n = el.querySelector('#ea-name') as HTMLInputElement;
    const e = el.querySelector('#ea-email') as HTMLInputElement;
    n.value = name;
    n.dispatchEvent(new Event('input'));
    e.value = email;
    e.dispatchEvent(new Event('input'));
  }

  const clickReserve = (el: HTMLElement) =>
    (el.querySelector('button[type="submit"]') as HTMLButtonElement).click();

  beforeEach(() => {
    auth = new FakeAuthService();
    submit = vi.fn(() => of({ id: '1', status: 'received' }));
  });

  it('shows the offer, the founder count and the pricing note', () => {
    const el: HTMLElement = render().nativeElement;
    expect(el.textContent).toContain('Lifetime access');
    expect(el.textContent).toContain('37/100');
    expect(el.textContent).toContain('founders');
    expect(el.textContent).toContain('Founder pricing announced soon');
    expect(el.textContent).toContain('Reserve my spot');
  });

  it('signed out: asks for name and email, then files an early_adopter submission', () => {
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    clickReserve(el);
    fixture.detectChanges();
    expect(submit).not.toHaveBeenCalled();
    expect(el.textContent).toContain('Please enter a valid email address.');

    fill(el, 'Ravi', 'ravi@example.com');
    clickReserve(el);
    fixture.detectChanges();
    expect(submit).toHaveBeenCalledWith({
      kind: 'early_adopter',
      product: 'karagre',
      website: '',
      name: 'Ravi',
      email: 'ravi@example.com',
    });
    expect(el.textContent).toContain('Your spot is reserved');
    expect(el.textContent).toContain('ravi@example.com');
  });

  it('signed in: skips name and email and uses the account', () => {
    auth.userSig.set(TEST_USER);
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('#ea-email')).toBeNull();
    expect(el.textContent).toContain('Reserving as asha@example.com');
    clickReserve(el);
    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'early_adopter',
        email: 'asha@example.com',
        name: 'Asha Rao',
      }),
    );
  });

  it('maps server field errors onto the inputs', () => {
    submit.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { error: 'validation', fields: { email: 'invalid_email' } },
          }),
      ),
    );
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    fill(el, 'Ravi', 'ravi@example.com');
    clickReserve(el);
    fixture.detectChanges();
    expect(el.textContent).toContain('Enter a valid email address.');
    expect(el.textContent).toContain('check the highlighted fields');
  });

  it('shows a rate-limit message on 429, and retry + mailto on other errors', () => {
    submit.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 429, error: { error: 'rate_limited' } })),
    );
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    fill(el, 'Ravi', 'ravi@example.com');
    clickReserve(el);
    fixture.detectChanges();
    expect(el.textContent).toContain('wait a minute');

    submit.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    clickReserve(el);
    fixture.detectChanges();
    expect(el.querySelector('app-form-error a')?.getAttribute('href')).toContain('mailto:');
    (el.querySelector('.form-error-retry') as HTMLButtonElement).click();
    expect(submit).toHaveBeenCalledTimes(3);
  });

  it('falls back to the waitlist when the offer is full', () => {
    const full = { ...PRODUCT, offer: { ...PRODUCT.offer!, claimed: 100 } };
    auth.userSig.set(TEST_USER);
    const fixture = render(full);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('All spots taken');
    clickReserve(el);
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ kind: 'waitlist' }));
  });
});
