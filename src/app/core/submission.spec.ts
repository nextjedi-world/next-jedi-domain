import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { of, throwError } from 'rxjs';
import {
  SubmissionController,
  applyFieldErrors,
  describeFieldReason,
  toSubmitFailure,
} from './submission';

const httpError = (status: number, error: unknown) => new HttpErrorResponse({ status, error });

describe('toSubmitFailure', () => {
  it('maps a 400 validation body to its fields', () => {
    expect(
      toSubmitFailure(httpError(400, { error: 'validation', fields: { email: 'invalid_email' } })),
    ).toEqual({ kind: 'validation', fields: { email: 'invalid_email' } });
  });

  it('maps 429 to rate_limited', () => {
    expect(toSubmitFailure(httpError(429, { error: 'rate_limited' }))).toEqual({
      kind: 'rate_limited',
    });
  });

  it('maps anything else to a generic error', () => {
    expect(toSubmitFailure(httpError(500, null))).toEqual({ kind: 'error', status: 500 });
    expect(toSubmitFailure(httpError(0, null))).toEqual({ kind: 'error', status: 0 });
    expect(toSubmitFailure(new Error('x'))).toEqual({ kind: 'error', status: 0 });
  });
});

describe('applyFieldErrors', () => {
  it('puts messages on matching controls and returns the rest', () => {
    const form = new FormGroup({ email: new FormControl('x') });
    const rest = applyFieldErrors(form, { email: 'invalid_email', product: 'unknown_product' });
    expect(form.controls.email.errors?.['server']).toBe('Enter a valid email address.');
    expect(form.controls.email.touched).toBe(true);
    expect(rest).toEqual(['product: Unknown product.']);
  });

  it('turns reasons into sentences', () => {
    expect(describeFieldReason('name', 'required')).toBe('This field is required.');
    expect(describeFieldReason('message', 'too_long')).toBe('This is too long.');
  });
});

describe('SubmissionController', () => {
  const form = () => new FormGroup({ email: new FormControl('', Validators.required) });

  it('goes to success and calls back with the response', () => {
    const c = new SubmissionController(form());
    const done = vi.fn();
    c.run(of({ id: '1' }), done);
    expect(c.state()).toBe('success');
    expect(done).toHaveBeenCalledWith({ id: '1' });
  });

  it('goes to invalid on a validation error', () => {
    const f = form();
    const c = new SubmissionController(f);
    c.run(
      throwError(() =>
        httpError(400, { error: 'validation', fields: { email: 'required', x: 'bad' } }),
      ),
    );
    expect(c.state()).toBe('invalid');
    expect(f.controls.email.errors?.['server']).toBe('This field is required.');
    expect(c.otherErrors()).toEqual(['x: Bad.']);
  });

  it('goes to rate_limited on 429 and error otherwise', () => {
    const c = new SubmissionController(form());
    c.run(throwError(() => httpError(429, { error: 'rate_limited' })));
    expect(c.state()).toBe('rate_limited');
    c.run(throwError(() => httpError(503, null)));
    expect(c.state()).toBe('error');
    c.reset();
    expect(c.state()).toBe('idle');
  });
});
