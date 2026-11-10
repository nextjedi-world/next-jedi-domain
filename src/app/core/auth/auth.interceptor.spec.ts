import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NJ_CONFIG } from '../config';
import { PlatformApi } from '../platform-api';
import { FakeAuthService, TEST_CONFIG, TEST_USER } from '../testing';
import { authTokenInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { SKIP_AUTH } from './skip-auth';

describe('authTokenInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let auth: FakeAuthService;

  /** Lets the interceptor's token promise resolve before we look for the request. */
  const tick = () => new Promise((r) => setTimeout(r, 0));

  beforeEach(() => {
    auth = new FakeAuthService();
    auth.userSig.set(TEST_USER);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: NJ_CONFIG, useValue: TEST_CONFIG },
        { provide: AuthService, useValue: auth },
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  });

  afterEach(() => ctrl.verify());

  it('adds the Bearer token to platform-api requests', async () => {
    http.get('http://localhost:4100/v1/me/submissions').subscribe();
    await tick();
    const req = ctrl.expectOne('http://localhost:4100/v1/me/submissions');
    expect(req.request.headers.get('Authorization')).toBe('Bearer access-1');
    req.flush({});
  });

  it('never sends the token to other origins (Identity, third parties)', async () => {
    http.get('http://localhost:4000/.well-known/openid-configuration').subscribe();
    http.get('https://example.com/x').subscribe();
    await tick();
    expect(
      ctrl
        .expectOne('http://localhost:4000/.well-known/openid-configuration')
        .request.headers.has('Authorization'),
    ).toBe(false);
    expect(ctrl.expectOne('https://example.com/x').request.headers.has('Authorization')).toBe(
      false,
    );
    expect(auth.getAccessToken).not.toHaveBeenCalled();
  });

  it('adds the Bearer token to the catalog and product requests when signed in', async () => {
    const api = TestBed.inject(PlatformApi);
    api.catalog().subscribe();
    api.product('karagre').subscribe();
    await tick();
    const catalog = ctrl.expectOne((r) => r.url === 'http://localhost:4100/v1/catalog');
    const product = ctrl.expectOne((r) => r.url === 'http://localhost:4100/v1/catalog/karagre');
    expect(catalog.request.headers.get('Authorization')).toBe('Bearer access-1');
    expect(product.request.headers.get('Authorization')).toBe('Bearer access-1');
    catalog.flush({ workspace: 'nextjedi', products: [] });
    product.flush({});
  });

  it('does not treat look-alike origins as platform-api', async () => {
    const lookalikes = [
      'http://localhost:41000/v1/catalog',
      'http://localhost:4100.evil.example/v1/catalog',
      'https://localhost:4100/v1/catalog',
      'http://evil.example/http://localhost:4100/v1/catalog',
    ];
    for (const url of lookalikes) http.get(url).subscribe();
    await tick();
    for (const url of lookalikes) {
      expect(ctrl.expectOne(url).request.headers.has('Authorization')).toBe(false);
    }
    expect(auth.getAccessToken).not.toHaveBeenCalled();
  });

  it('skips the token for anonymous requests', async () => {
    http
      .post(
        'http://localhost:4100/v1/submissions',
        {},
        { context: new HttpContext().set(SKIP_AUTH, true) },
      )
      .subscribe();
    await tick();
    expect(
      ctrl.expectOne('http://localhost:4100/v1/submissions').request.headers.has('Authorization'),
    ).toBe(false);
  });

  it('sends no header when signed out', async () => {
    auth.userSig.set(null);
    http.get('http://localhost:4100/v1/catalog').subscribe();
    await tick();
    expect(
      ctrl.expectOne('http://localhost:4100/v1/catalog').request.headers.has('Authorization'),
    ).toBe(false);
  });

  it('refreshes once on 401 and retries with the new token', async () => {
    let body: unknown;
    http.get('http://localhost:4100/v1/me/submissions').subscribe((b) => (body = b));
    await tick();
    ctrl
      .expectOne('http://localhost:4100/v1/me/submissions')
      .flush({ error: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    await tick();
    const retry = ctrl.expectOne('http://localhost:4100/v1/me/submissions');
    expect(retry.request.headers.get('Authorization')).toBe('Bearer access-2');
    retry.flush({ submissions: [] });
    expect(auth.refresh).toHaveBeenCalledTimes(1);
    expect(body).toEqual({ submissions: [] });
  });

  it('passes the 401 on when the refresh fails', async () => {
    auth.refreshed = null;
    let status = 0;
    http
      .get('http://localhost:4100/v1/me/submissions')
      .subscribe({ error: (e) => (status = e.status) });
    await tick();
    ctrl
      .expectOne('http://localhost:4100/v1/me/submissions')
      .flush({ error: 'unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    await tick();
    expect(status).toBe(401);
  });
});
