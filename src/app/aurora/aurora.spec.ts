import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { AuroraPage } from './aurora';
import { AuroraService } from './aurora.service';

function setup(submit: () => Observable<void> = () => of(undefined)) {
  const service = { submitWaitlist: vi.fn(submit), submitIdea: vi.fn(() => of(undefined)) };
  TestBed.configureTestingModule({
    imports: [AuroraPage],
    providers: [provideRouter([]), { provide: AuroraService, useValue: service }],
  });
  const fixture = TestBed.createComponent(AuroraPage);
  fixture.detectChanges();
  return { cmp: fixture.componentInstance, service };
}

function fillStep1(cmp: AuroraPage) {
  cmp.waitlistForm.patchValue({ name: 'Ada', email: 'ada@example.com' });
}

describe('Aurora waitlist steps', () => {
  it('blocks step 1 until email and name are valid', () => {
    const { cmp } = setup();
    cmp.nextStep();
    expect(cmp.step()).toBe(1);
    cmp.waitlistForm.patchValue({ name: 'Ada', email: 'bad' });
    cmp.nextStep();
    expect(cmp.step()).toBe(1);
    fillStep1(cmp);
    cmp.nextStep();
    expect(cmp.step()).toBe(2);
  });

  it('requires an interest on step 2 and announces step changes', () => {
    const { cmp } = setup();
    fillStep1(cmp);
    cmp.nextStep();
    cmp.nextStep();
    expect(cmp.step()).toBe(2);
    expect(cmp.interestsError()).toBe(true);
    cmp.toggleInterest('Games and puzzles');
    expect(cmp.interestsError()).toBe(false);
    cmp.nextStep();
    expect(cmp.step()).toBe(3);
    expect(cmp.announcement()).toBe('Step 3 of 3: Feature request');
  });

  it('keeps state when going back', () => {
    const { cmp } = setup();
    fillStep1(cmp);
    cmp.nextStep();
    cmp.toggleInterest('Developer tools');
    cmp.nextStep();
    cmp.prevStep();
    cmp.prevStep();
    expect(cmp.step()).toBe(1);
    expect(cmp.wEmail.value).toBe('ada@example.com');
    expect(cmp.interests()).toEqual(['Developer tools']);
  });

  it('submits once at the end, then shows success and resets', () => {
    const { cmp, service } = setup();
    fillStep1(cmp);
    cmp.nextStep();
    cmp.toggleInterest('Developer tools');
    cmp.nextStep();
    cmp.waitlistForm.patchValue({ feature: 'Dark mode' });
    cmp.onJoinWaitlist();
    expect(service.submitWaitlist).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@example.com',
      feature: 'Dark mode',
      app: 'Developer tools',
    });
    expect(cmp.waitlistState).toBe('success');
    expect(cmp.step()).toBe(1);
  });

  it('keeps partial state on submit failure', () => {
    const { cmp } = setup(() => throwError(() => new Error('x')));
    fillStep1(cmp);
    cmp.nextStep();
    cmp.toggleInterest('Developer tools');
    cmp.nextStep();
    cmp.onJoinWaitlist();
    expect(cmp.waitlistState).toBe('error');
    expect(cmp.step()).toBe(3);
    expect(cmp.wEmail.value).toBe('ada@example.com');
    expect(cmp.interests()).toEqual(['Developer tools']);
  });
});

describe('Aurora accessibility', () => {
  function render() {
    TestBed.configureTestingModule({
      imports: [AuroraPage],
      providers: [
        provideRouter([]),
        { provide: AuroraService, useValue: { submitWaitlist: vi.fn(() => of(undefined)), submitIdea: vi.fn(() => of(undefined)) } },
      ],
    });
    const fixture = TestBed.createComponent(AuroraPage);
    fixture.detectChanges();
    return fixture;
  }

  it('labels the idea textarea and the step 1 inputs', () => {
    const fixture = render();
    const el: HTMLElement = fixture.nativeElement;
    const area = el.querySelector('#idea-description');
    expect(area).toBeTruthy();
    expect(el.querySelector('label[for="idea-description"]')).toBeTruthy();
    expect(el.querySelector('label[for="wl-name"]')).toBeTruthy();
    expect(el.querySelector('label[for="wl-email"]')).toBeTruthy();
  });

  it('links invalid fields to their error message', () => {
    const fixture = render();
    fixture.componentInstance.nextStep();
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('#wl-name')?.getAttribute('aria-describedby')).toBe('wl-name-error');
    expect(el.querySelector('#wl-name-error')?.getAttribute('role')).toBe('alert');
  });

  it('hides decorative icons from assistive tech', () => {
    const el: HTMLElement = render().nativeElement;
    const icons = el.querySelectorAll('.material-symbols-outlined');
    expect(icons.length).toBeGreaterThan(0);
    icons.forEach((i) => expect(i.getAttribute('aria-hidden')).toBe('true'));
  });
});
