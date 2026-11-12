import { TestBed } from '@angular/core/testing';
import { NjToast } from './toast';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('adds success, error and info toasts', () => {
    const s = TestBed.inject(ToastService);
    s.success('a');
    s.error('b');
    s.info('c');
    expect(s.toasts().map((t) => t.kind)).toEqual(['success', 'error', 'info']);
  });

  it('auto-dismisses after the duration', () => {
    const s = TestBed.inject(ToastService);
    s.info('bye', 1000);
    expect(s.toasts().length).toBe(1);
    vi.advanceTimersByTime(1000);
    expect(s.toasts().length).toBe(0);
  });

  it('keeps the toast when duration is 0 until dismissed', () => {
    const s = TestBed.inject(ToastService);
    const id = s.info('sticky', 0);
    vi.advanceTimersByTime(60000);
    expect(s.toasts().length).toBe(1);
    s.dismiss(id);
    expect(s.toasts().length).toBe(0);
  });
});

describe('NjToast', () => {
  it('renders toasts with aria-live regions', () => {
    const fixture = TestBed.createComponent(NjToast);
    const s = TestBed.inject(ToastService);
    s.success('Saved', 0);
    s.error('Failed', 0);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const items = el.querySelectorAll('.nj-toast');
    expect(items.length).toBe(2);
    expect(items[0].getAttribute('aria-live')).toBe('polite');
    expect(items[1].getAttribute('aria-live')).toBe('assertive');
    expect(items[1].getAttribute('role')).toBe('alert');
  });

  it('dismisses on close click', () => {
    const fixture = TestBed.createComponent(NjToast);
    TestBed.inject(ToastService).info('x', 0);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    el.querySelector<HTMLButtonElement>('.nj-toast-close')!.click();
    fixture.detectChanges();
    expect(el.querySelectorAll('.nj-toast').length).toBe(0);
  });
});
