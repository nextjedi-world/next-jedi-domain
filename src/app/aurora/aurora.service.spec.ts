import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AuroraService, SubmitError } from './aurora.service';

function reply(body: unknown, init: ResponseInit = { status: 200 }): Response {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), init);
}

describe('AuroraService', () => {
  let service: AuroraService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuroraService);
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('resolves when the script returns ok:true', async () => {
    fetchMock.mockResolvedValue(reply({ ok: true }));
    await expect(firstValueFrom(service.submitIdea({ description: 'x' }))).resolves.toBeUndefined();
  });

  it('posts a CORS simple request (text/plain, cors mode) with the type in the body', async () => {
    fetchMock.mockResolvedValue(reply({ ok: true }));
    await firstValueFrom(
      service.submitSupport({ name: 'Ann', email: 'a@b.co', app: 'Sudoku', message: 'hi' }),
    );
    const [, init] = fetchMock.mock.calls[0];
    expect(init.mode).toBeUndefined();
    expect(init.headers).toEqual({ 'Content-Type': 'text/plain;charset=utf-8' });
    expect(JSON.parse(init.body)).toMatchObject({ type: 'support', name: 'Ann', message: 'hi' });
  });

  it('fails on an HTTP error', async () => {
    fetchMock.mockResolvedValue(reply('nope', { status: 500 }));
    await expect(firstValueFrom(service.submitIdea({ description: 'x' }))).rejects.toThrow('HTTP 500');
  });

  it('fails when the script returns ok:false, with its error', async () => {
    fetchMock.mockResolvedValue(reply({ ok: false, error: 'Name is required' }));
    const err = await firstValueFrom(
      service.submitWaitlist({ name: '', email: 'a@b.co', feature: '' }),
    ).catch((e) => e);
    expect(err).toBeInstanceOf(SubmitError);
    expect(err.message).toBe('Name is required');
  });

  it('fails when the body is not JSON (such as an HTML error page)', async () => {
    fetchMock.mockResolvedValue(reply('<html>Sign in</html>'));
    await expect(firstValueFrom(service.submitIdea({ description: 'x' }))).rejects.toBeInstanceOf(
      SubmitError,
    );
  });

  it('fails on a network error', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(firstValueFrom(service.submitIdea({ description: 'x' }))).rejects.toThrow(
      'Network error',
    );
  });
});
