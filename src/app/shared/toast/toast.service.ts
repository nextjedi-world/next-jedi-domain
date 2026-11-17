import { Injectable, signal } from '@angular/core';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

export const TOAST_DURATION_MS = 5000;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(kind: ToastKind, message: string, durationMs = TOAST_DURATION_MS): number {
    const id = this.nextId++;
    this._toasts.update((list) => [...list, { id, kind, message }]);
    if (durationMs > 0) {
      this.timers.set(
        id,
        setTimeout(() => this.dismiss(id), durationMs),
      );
    }
    return id;
  }

  success(message: string, durationMs?: number): number {
    return this.show('success', message, durationMs);
  }

  error(message: string, durationMs?: number): number {
    return this.show('error', message, durationMs);
  }

  info(message: string, durationMs?: number): number {
    return this.show('info', message, durationMs);
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
