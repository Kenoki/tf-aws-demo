import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SERVICES } from '../content/services';
import { SITE } from '../content/site';
import { ServiceCard } from '../shared/service-card';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ServiceCard],
  template: `
    <section class="flex flex-col gap-6 py-10 sm:py-16">
      <p class="font-mono text-sm text-aws">Terraform · AWS · Cloudflare</p>
      <h1 class="max-w-3xl text-4xl font-semibold leading-tight text-balance sm:text-5xl">
        {{ site.tagline }}
      </h1>
      <p class="max-w-2xl text-lg leading-relaxed text-muted">{{ site.lead }}</p>
      <div class="flex flex-wrap gap-3">
        <a
          routerLink="/arquitectura"
          class="rounded-lg bg-fg px-5 py-2.5 text-sm font-semibold text-bg hover:opacity-90"
        >
          Ver la arquitectura
        </a>
        <a
          [href]="site.repoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-semibold hover:border-accent"
        >
          Repositorio en GitHub
        </a>
      </div>
    </section>

    <section aria-labelledby="servicios" class="flex flex-col gap-5 pb-12">
      <div class="flex flex-col gap-1">
        <h2 id="servicios" class="text-2xl font-semibold">Servicios que la hacen posible</h2>
        <p class="max-w-2xl text-muted">
          Cada tarjeta indica qué hace el servicio y qué recursos de Terraform lo crean.
        </p>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (service of services; track service.id) {
          <app-service-card [service]="service" />
        }
      </div>
    </section>
  `,
})
export class Home {
  protected readonly site = SITE;
  protected readonly services = SERVICES;
}
