import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_NAME, SITE_URL, SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let title: Title;
  let meta: Meta;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoService);
    title = TestBed.inject(Title);
    meta = TestBed.inject(Meta);
  });

  it('appends the site name to the title', () => {
    service.set({ title: 'Team', description: 'The team' });
    expect(title.getTitle()).toBe(`Team | ${SITE_NAME}`);
  });

  it('does not repeat the site name', () => {
    service.set({ title: `${SITE_NAME} home`, description: 'Home' });
    expect(title.getTitle()).toBe(`${SITE_NAME} home`);
  });

  it('sets the description meta tag', () => {
    service.set({ title: 'Team', description: 'The team', path: '/team' });
    expect(meta.getTag('name="description"')?.content).toBe('The team');
    expect(SITE_URL).toBe('https://nextjedi.com');
  });
});
