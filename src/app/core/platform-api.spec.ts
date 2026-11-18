import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SKIP_AUTH } from './auth/skip-auth';
import { NJ_CONFIG, isPlatformApiUrl } from './config';
import { PlatformApi } from './platform-api';
import { TEST_CONFIG } from './testing';

describe('isPlatformApiUrl', () => {
  it('matches the API origin and paths under it only', () => {
    expect(isPlatformApiUrl('http://localhost:4100/v1/catalog', TEST_CONFIG)).toBe(true);
    expect(isPlatformApiUrl('http://localhost:4100', TEST_CONFIG)).toBe(true);
    expect(isPlatformApiUrl('http://localhost:41000/v1', TEST_CONFIG)).toBe(false);
    expect(isPlatformApiUrl('http://localhost:4000/token', TEST_CONFIG)).toBe(false);
    expect(isPlatformApiUrl('https://evil.example/http://localhost:4100', TEST_CONFIG)).toBe(false);
  });
});

describe('PlatformApi', () => {
  let api: PlatformApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NJ_CONFIG, useValue: TEST_CONFIG },
      ],
    });
    api = TestBed.inject(PlatformApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets the catalog for the workspace', () => {
    let count = -1;
    api.catalog().subscribe((r) => (count = r.products.length));
    const req = http.expectOne('http://localhost:4100/v1/catalog?ws=nextjedi');
    expect(req.request.method).toBe('GET');
    req.flush({ workspace: 'nextjedi', products: [] });
    expect(count).toBe(0);
  });

  it('gets one product, URL-encoding the id', () => {
    api.product('a b').subscribe();
    http.expectOne('http://localhost:4100/v1/catalog/a%20b?ws=nextjedi').flush({});
  });

  it('posts a submission with the workspace in the body', () => {
    api
      .submit({ kind: 'early_adopter', product: 'karagre', email: 'a@b.co', website: '' })
      .subscribe();
    const req = http.expectOne('http://localhost:4100/v1/submissions');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      ws: 'nextjedi',
      kind: 'early_adopter',
      product: 'karagre',
      email: 'a@b.co',
      website: '',
    });
    expect(req.request.context.get(SKIP_AUTH)).toBe(false);
    req.flush({ id: 'x', status: 'received' }, { status: 201, statusText: 'Created' });
  });

  it('marks anonymous submissions so the token is not sent', () => {
    api.submit({ kind: 'idea', message: 'hi' }, { anonymous: true }).subscribe();
    const req = http.expectOne('http://localhost:4100/v1/submissions');
    expect(req.request.context.get(SKIP_AUTH)).toBe(true);
    req.flush({ id: 'x', status: 'received' });
  });

  it('reads my submissions and entitlements', () => {
    api.mySubmissions().subscribe();
    http.expectOne('http://localhost:4100/v1/me/submissions').flush({ submissions: [] });
    api.myEntitlements('karagre').subscribe();
    http
      .expectOne('http://localhost:4100/v1/me/entitlements?product=karagre')
      .flush({ product: 'karagre', entitlements: [] });
  });
});
