import { Component, computed, input } from '@angular/core';
import { DnsMode } from '../content/modes';

@Component({
  selector: 'app-architecture-diagram',
  template: `
    <div class="overflow-x-auto rounded-xl border border-line bg-surface p-3 sm:p-4">
      <svg
        viewBox="0 0 1120 420"
        role="img"
        [attr.aria-label]="label()"
        class="block h-auto w-full min-w-[720px]"
      >
        <defs>
          <marker
            id="diagram-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10z" class="fill-fg" />
          </marker>
        </defs>

        <!-- Usuario -->
        <rect x="10" y="160" width="110" height="70" rx="10" class="fill-surface stroke-line" stroke-width="2" />
        <text x="65" y="201" text-anchor="middle" class="fill-fg text-[16px] font-semibold">Usuario</text>
        <path d="M120 195 H190" class="fill-none stroke-fg" stroke-width="2.5" marker-end="url(#diagram-arrow)" />
        <text x="155" y="183" text-anchor="middle" class="fill-fg text-[13px] font-medium">consulta</text>

        <!-- Cloudflare -->
        <rect x="190" y="135" width="190" height="120" rx="12" class="fill-cf-tint stroke-cf" stroke-width="2.5" />
        <text x="285" y="190" text-anchor="middle" class="fill-cf text-[18px] font-semibold">Cloudflare</text>
        <text x="285" y="214" text-anchor="middle" class="fill-muted text-[13px]">dominio raíz</text>

        <!-- AWS -->
        <rect x="470" y="30" width="640" height="360" rx="14" class="fill-aws-tint stroke-aws" stroke-width="2.5" />
        <image href="icons/aws-cloud.svg" x="488" y="42" width="34" height="34" />
        <text x="534" y="66" class="fill-aws text-[18px] font-semibold">AWS</text>

        @if (mode() === 'route53') {
          <path d="M380 195 H500" class="fill-none stroke-fg" stroke-width="2.5" marker-end="url(#diagram-arrow)" />
          <text x="425" y="183" text-anchor="middle" class="fill-fg text-[13px] font-medium">delega NS</text>

          <text x="550" y="146" text-anchor="middle" class="fill-fg text-[16px] font-semibold">Route 53</text>
          <image href="icons/route53.svg" x="510" y="155" width="80" height="80" />
          <text x="550" y="258" text-anchor="middle" class="fill-muted text-[13px]">zona del subdominio</text>

          <path d="M590 195 H710" class="fill-none stroke-fg" stroke-width="2.5" marker-end="url(#diagram-arrow)" />
          <text x="650" y="183" text-anchor="middle" class="fill-fg text-[13px] font-medium">alias A</text>
        } @else {
          <path d="M380 195 H710" class="fill-none stroke-fg" stroke-width="2.5" marker-end="url(#diagram-arrow)" />
          <text x="545" y="183" text-anchor="middle" class="fill-fg text-[13px] font-medium">CNAME (DNS only)</text>
          <text x="545" y="222" text-anchor="middle" class="fill-muted text-[13px]">sin Route 53 en este modo</text>
        }

        <!-- CloudFront -->
        <text x="760" y="146" text-anchor="middle" class="fill-fg text-[16px] font-semibold">CloudFront</text>
        <image href="icons/cloudfront.svg" x="720" y="155" width="80" height="80" />
        <path d="M800 195 H950" class="fill-none stroke-fg" stroke-width="2.5" marker-end="url(#diagram-arrow)" />
        <text x="875" y="183" text-anchor="middle" class="fill-fg text-[13px] font-medium">OAC</text>

        <!-- S3 -->
        <text x="1000" y="146" text-anchor="middle" class="fill-fg text-[16px] font-semibold">S3</text>
        <image href="icons/s3.svg" x="960" y="155" width="80" height="80" />
        <text x="1000" y="258" text-anchor="middle" class="fill-muted text-[13px]">bucket privado</text>

        <!-- ACM -->
        <image href="icons/acm.svg" x="728" y="296" width="64" height="64" />
        <path d="M760 296 V244" class="fill-none stroke-fg" stroke-width="2.5" marker-end="url(#diagram-arrow)" />
        <text x="774" y="274" class="fill-fg text-[13px] font-medium">certificado</text>
        <text x="806" y="326" class="fill-fg text-[16px] font-semibold">ACM</text>
        <text x="806" y="346" class="fill-muted text-[13px]">us-east-1 · validación DNS</text>
      </svg>
    </div>
  `,
})
export class ArchitectureDiagram {
  readonly mode = input.required<DnsMode>();

  protected readonly label = computed(() =>
    this.mode() === 'route53'
      ? 'Arquitectura en modo route53: el usuario consulta Cloudflare, que delega el subdominio a Route 53; Route 53 apunta con un alias A a CloudFront, que usa un certificado de ACM y lee un bucket S3 privado con Origin Access Control.'
      : 'Arquitectura en modo cloudflare: el usuario consulta Cloudflare, que apunta con un CNAME directo a CloudFront; CloudFront usa un certificado de ACM y lee un bucket S3 privado con Origin Access Control.',
  );
}
