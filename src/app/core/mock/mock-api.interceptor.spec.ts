import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { NJ_CONFIG } from '../config';
import { CatalogProduct } from '../platform-api.models';
import { TEST_CONFIG } from '../testing';
import { mockApiInterceptor, mockSettings, resetMockCatalog } from './mock-api.interceptor';

describe('mockApiInterceptor', () => {
  let http: HttpClient;
  const api = 'http://localhost:4100';

  beforeEach(() => {
    mockSettings.delayMs = 0;
    resetMockCatalog();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([mockApiInterceptor])),
        { provide: NJ_CONFIG, useValue: { ...TEST_CONFIG, useMock: true } },
      ],
    });
    http = TestBed.inject(HttpClient);
  });

  it('serves the catalog in the contract shape', async () => {
    const res = await firstValueFrom(
      http.get<{ workspace: string; products: CatalogProduct[] }>(`${api}/v1/catalog?ws=nextjedi`),
    );
    expect(res.workspace).toBe('nextjedi');
    const karagre = res.products.find((p) => p.id === 'karagre')!;
    expect(karagre.offer).toMatchObject({ cap: 100, claimed: 37, purchasable: false });
  });

  it('404s an unknown product', async () => {
    await expect(firstValueFrom(http.get(`${api}/v1/catalog/nope`))).rejects.toMatchObject({
      status: 404,
      error: { error: 'not_found' },
    });
  });

  it('counts an early_adopter reservation', async () => {
    const res = await firstValueFrom(
      http.post(`${api}/v1/submissions`, {
        ws: 'nextjedi',
        kind: 'early_adopter',
        product: 'karagre',
        email: 'a@b.co',
      }),
    );
    expect(res).toMatchObject({ status: 'received' });
    const p = await firstValueFrom(http.get<CatalogProduct>(`${api}/v1/catalog/karagre`));
    expect(p.offer?.claimed).toBe(38);
  });

  it('returns the contract errors', async () => {
    const post = (body: object) => firstValueFrom(http.post(`${api}/v1/submissions`, body));
    await expect(post({ kind: 'waitlist' })).rejects.toMatchObject({
      status: 400,
      error: { error: 'validation', fields: { email: 'required' } },
    });
    await expect(post({ kind: 'waitlist', email: 'ratelimit@x.co' })).rejects.toMatchObject({
      status: 429,
    });
    await expect(post({ kind: 'waitlist', email: 'servererror@x.co' })).rejects.toMatchObject({
      status: 500,
    });
  });

  it('requires a token for /v1/me', async () => {
    await expect(firstValueFrom(http.get(`${api}/v1/me/submissions`))).rejects.toMatchObject({
      status: 401,
    });
    const res = await firstValueFrom(
      http.get(`${api}/v1/me/submissions`, { headers: { Authorization: 'Bearer x' } }),
    );
    expect(res).toHaveProperty('submissions');
  });
});
