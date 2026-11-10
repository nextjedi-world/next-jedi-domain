import { TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { mockProducts } from '../core/mock/mock-data';
import { PlatformApi } from '../core/platform-api';
import { CatalogResponse } from '../core/platform-api.models';
import { FakeAuthService } from '../core/testing';
import { IdeasPage } from './ideas';

describe('IdeasPage', () => {
  function render(catalog: () => unknown) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: new FakeAuthService() },
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
});
