import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { throwError } from 'rxjs';
import { AuroraPage } from './aurora';
import { AuroraService } from './aurora.service';

describe('AuroraPage form error state', () => {
  it('shows the error with retry and mailto when the save fails, and not the success message', async () => {
    const submit = vi.fn(() => throwError(() => new Error('boom')));
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuroraService, useValue: { submitIdea: submit, submitWaitlist: submit } }],
    });
    const fixture = TestBed.createComponent(AuroraPage);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    const form = el.querySelector('form.request-form') as HTMLFormElement;
    const textarea = form.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'an idea';
    textarea.dispatchEvent(new Event('input'));
    form.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(el.textContent).not.toContain('Idea submitted!');
    expect(el.querySelector('app-form-error [role="alert"]')).not.toBeNull();
    expect(el.querySelector('app-form-error a')!.getAttribute('href')).toContain('mailto:');

    (el.querySelector('app-form-error button') as HTMLButtonElement).click();
    expect(submit).toHaveBeenCalledTimes(2);
  });
});
