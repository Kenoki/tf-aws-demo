import { TestBed } from '@angular/core/testing';
import { Architecture } from './architecture';

describe('Architecture', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Architecture] }).compileComponents();
  });

  it('should start in route53 mode and show the Route 53 resources', async () => {
    const fixture = TestBed.createComponent(Architecture);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('aws_route53_zone.sub');
    expect(text).not.toContain('cloudflare_dns_record.site');
  });

  it('should switch the resources when the cloudflare mode is selected', async () => {
    const fixture = TestBed.createComponent(Architecture);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(root.querySelectorAll('button'));
    buttons.find((b) => b.textContent?.trim() === 'cloudflare')?.click();
    await fixture.whenStable();
    const text = root.textContent ?? '';
    expect(text).toContain('cloudflare_dns_record.site');
    expect(text).not.toContain('aws_route53_zone.sub');
  });
});
