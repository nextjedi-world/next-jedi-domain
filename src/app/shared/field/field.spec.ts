import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NjField } from './field';

@Component({
  imports: [NjField],
  template: `
    <nj-field #f="njField" label="Email" hint="We never share it" [error]="err" [required]="true">
      <input [id]="f.controlId" [attr.aria-describedby]="f.describedBy()" [attr.aria-invalid]="!!err" />
    </nj-field>
  `,
})
class Host {
  err = '';
}

describe('NjField', () => {
  it('wires label to the control', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('input')!;
    expect(el.querySelector('label')!.getAttribute('for')).toBe(input.id);
    expect(el.querySelector('label')!.textContent).toContain('Email');
  });

  it('shows the hint and describes the control by it', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const hint = el.querySelector('.nj-field-hint')!;
    expect(hint.textContent).toContain('never share');
    expect(el.querySelector('input')!.getAttribute('aria-describedby')).toBe(hint.id);
  });

  it('shows the error (role=alert) instead of the hint', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.err = 'Required';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const error = el.querySelector('.nj-field-error')!;
    expect(error.getAttribute('role')).toBe('alert');
    expect(el.querySelector('.nj-field-hint')).toBeNull();
    expect(el.querySelector('input')!.getAttribute('aria-describedby')).toBe(error.id);
    expect(el.querySelector('input')!.getAttribute('aria-invalid')).toBe('true');
  });
});
