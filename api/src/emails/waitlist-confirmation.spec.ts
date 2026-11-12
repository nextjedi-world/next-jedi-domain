import { escapeHtml, renderWaitlistConfirmation, WAITLIST_SUBJECT } from './waitlist-confirmation';

describe('renderWaitlistConfirmation', () => {
  it('renders sample data with the key strings', () => {
    const { subject, html } = renderWaitlistConfirmation({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    });
    expect(subject).toBe(WAITLIST_SUBJECT);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Hey Ada,');
    expect(html).toContain('Project Aurora');
    expect(html).toContain('Early Access Confirmed');
    expect(html).toContain('What happens next');
    expect(html).not.toContain('${');
  });

  it('escapes HTML in the name', () => {
    const { html } = renderWaitlistConfirmation({
      name: '<script>alert(1)</script>',
      email: 'x@example.com',
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('Hey &lt;script&gt;alert(1)&lt;/script&gt;,');
  });

  it('falls back when the name is empty', () => {
    expect(renderWaitlistConfirmation({ name: '  ', email: 'a@b.c' }).html).toContain('Hey there,');
  });

  it('escapeHtml handles quotes and ampersands', () => {
    expect(escapeHtml(`a&b"c'd`)).toBe('a&amp;b&quot;c&#39;d');
  });
});
