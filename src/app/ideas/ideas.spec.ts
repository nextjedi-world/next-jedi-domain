import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { mockProducts } from '../core/mock/mock-data';
import { PlatformApi } from '../core/platform-api';
import { CatalogResponse } from '../core/platform-api.models';
import { FakeAuthService, TEST_USER } from '../core/testing';
import { IdeasPage } from './ideas';

describe('IdeasPage', () => {
  let auth: FakeAuthService;

  beforeEach(() => {
    auth = new FakeAuthService();
  });

  function render(catalog: () => unknown) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: auth },
        { provide: PlatformApi, useValue: { catalog } },
      ],
    });
    const fixture = TestBed.createComponent(IdeasPage);
    fixture.detectChanges();
    return fixture;
  }

  it('shows a loading state, then a card per product with its status', () => {
    const res = new Subject<CatalogResponse>();
    const fixture = render(() => res);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('[aria-busy="true"]')).not.toBeNull();

    res.next({ workspace: 'nextjedi', products: mockProducts() });
    fixture.detectChanges();
    const cards = el.querySelectorAll('a.idea-card');
    expect(cards.length).toBe(mockProducts().length);
    expect(cards[0].getAttribute('href')).toBe('/ideas/karagre');
    expect(cards[0].textContent).toContain('Building');
    expect(cards[0].textContent).toContain('37/100');
    expect(TestBed.inject(Title).getTitle()).toContain('Ideas');
  });

  it('shows the empty state', () => {
    const el: HTMLElement = render(() => of({ workspace: 'nextjedi', products: [] })).nativeElement;
    expect(el.textContent).toContain('No ideas to show yet');
  });

  it('shows the error state and retries', () => {
    const catalog = vi.fn(() => throwError(() => new Error('down')));
    const fixture = render(catalog);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain("We couldn't load the ideas");
    (el.querySelector('.state-box button') as HTMLButtonElement).click();
    expect(catalog).toHaveBeenCalledTimes(2);
  });

  it('re-fetches the catalog quietly after sign-in and sign-out', () => {
    const catalog = vi.fn(() => of({ workspace: 'nextjedi', products: mockProducts() }));
    const fixture = render(catalog);
    TestBed.tick();
    expect(catalog).toHaveBeenCalledTimes(1);

    auth.userSig.set(TEST_USER);
    TestBed.tick();
    expect(catalog).toHaveBeenCalledTimes(2);

    auth.userSig.set(null);
    TestBed.tick();
    expect(catalog).toHaveBeenCalledTimes(3);
    expect(fixture.nativeElement.querySelectorAll('a.idea-card').length).toBe(
      mockProducts().length,
    );
  });

  it('re-fetches once a stored session is restored after the first load', () => {
    auth.readySig.set(false);
    const catalog = vi.fn(() => of({ workspace: 'nextjedi', products: mockProducts() }));
    render(catalog);
    TestBed.tick();
    expect(catalog).toHaveBeenCalledTimes(1);

    auth.userSig.set(TEST_USER);
    auth.readySig.set(true);
    TestBed.tick();
    expect(catalog).toHaveBeenCalledTimes(2);
  });

  it('does not re-fetch when the session check finds nobody signed in', () => {
    auth.readySig.set(false);
    const catalog = vi.fn(() => of({ workspace: 'nextjedi', products: mockProducts() }));
    render(catalog);
    auth.readySig.set(true);
    TestBed.tick();
    expect(catalog).toHaveBeenCalledTimes(1);
  });

  it('marks the card of an offer the viewer already holds', () => {
    const products = mockProducts();
    products[0].offer!.reserved = true;
    const el: HTMLElement = render(() => of({ workspace: 'nextjedi', products })).nativeElement;
    expect(el.querySelector('a.idea-card')?.textContent).toContain('Your spot is reserved');
  });
});
