import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { NJ_CONFIG } from '../config';
import { MOCK_ACCESS_TOKEN } from '../auth/mock-auth.service';
import { CatalogProduct, CatalogResponse } from '../platform-api.models';
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

  it('sends offer.reserved only to signed-in requests', async () => {
    const signedIn = { headers: { Authorization: `Bearer ${MOCK_ACCESS_TOKEN}` } };
    const anon = await firstValueFrom(http.get<CatalogProduct>(`${api}/v1/catalog/karagre`));
    expect(anon.offer).not.toHaveProperty('reserved');

    const karagre = await firstValueFrom(
      http.get<CatalogProduct>(`${api}/v1/catalog/karagre`, signedIn),
    );
    expect(karagre.offer?.reserved).toBe(true);
    const all = await firstValueFrom(http.get<CatalogResponse>(`${api}/v1/catalog`, signedIn));
    expect(all.products.find((p) => p.id === 'mindful-journal')?.offer?.reserved).toBe(false);
    expect(all.products.find((p) => p.id === 'sudoku')?.offer).toBeNull();
  });

  it('answers a repeat reservation with 200 already_reserved and does not count it', async () => {
    const reserve = (email: string) =>
      firstValueFrom(
        http.post(
          `${api}/v1/submissions`,
          { ws: 'nextjedi', kind: 'early_adopter', product: 'mindful-journal', email },
          { observe: 'response' },
        ),
      );
    const first = await reserve('a@b.co');
    expect(first.status).toBe(201);
    expect(first.body).toMatchObject({ status: 'received' });
    const again = await reserve('A@B.co');
    expect(again.status).toBe(200);
    expect(again.body).toMatchObject({ status: 'already_reserved' });
    const p = await firstValueFrom(http.get<CatalogProduct>(`${api}/v1/catalog/mindful-journal`));
    expect(p.offer?.claimed).toBe(13);
  });

  it('knows the mock user already holds the Karagre spot', async () => {
    const res = await firstValueFrom(
      http.post(`${api}/v1/submissions`, {
        ws: 'nextjedi',
        kind: 'early_adopter',
        product: 'karagre',
        email: 'asha@example.com',
      }),
    );
    expect(res).toMatchObject({ status: 'already_reserved' });
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
