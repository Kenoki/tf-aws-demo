import { Component, computed, signal } from '@angular/core';
import { REQUEST_FLOW } from '../content/flow';
import { COMMON_RESOURCES, DnsMode, MODES } from '../content/modes';
import { ArchitectureDiagram } from '../shared/architecture-diagram';

@Component({
  selector: 'app-architecture',
  imports: [ArchitectureDiagram],
  template: `
    <section class="flex flex-col gap-6 py-10">
      <header class="flex flex-col gap-2">
        <h1 class="text-3xl font-semibold sm:text-4xl">Arquitectura</h1>
        <p class="max-w-2xl text-muted">
          El DNS del subdominio se resuelve de dos formas, según la variable
          <code class="font-mono text-sm">dns_delegated_by</code>. Cambia el modo y mira qué
          recursos cambian.
        </p>
      </header>

      <div role="group" aria-label="Modo de DNS" class="inline-flex w-fit rounded-lg border border-line bg-surface p-1">
        @for (item of modes; track item.id) {
          <button
            type="button"
            class="rounded-md px-4 py-1.5 font-mono text-sm font-medium focus-visible:outline-2 focus-visible:outline-accent"
            [class]="mode() === item.id ? 'bg-fg text-bg' : 'text-muted hover:text-fg'"
            [attr.aria-pressed]="mode() === item.id"
            (click)="mode.set(item.id)"
          >
            {{ item.label }}
          </button>
        }
      </div>

      <app-architecture-diagram [mode]="mode()" />

      <p class="max-w-3xl leading-relaxed">{{ current().summary }}</p>
    </section>

    <section aria-labelledby="recursos" class="grid gap-6 pb-10 md:grid-cols-2">
      <div class="flex flex-col gap-3">
        <h2 id="recursos" class="text-xl font-semibold">Recursos de Terraform</h2>
        <h3 class="text-sm font-semibold text-muted">En ambos modos</h3>
        <ul class="flex flex-col gap-1.5">
          @for (resource of common; track resource) {
            <li class="font-mono text-sm">{{ resource }}</li>
          }
        </ul>
        <h3 class="mt-2 text-sm font-semibold text-muted">
          Solo en modo <span class="font-mono">{{ current().label }}</span>
        </h3>
        <ul class="flex flex-col gap-1.5">
          @for (resource of current().resources; track resource) {
            <li class="font-mono text-sm text-aws">{{ resource }}</li>
          }
        </ul>
      </div>

      <div class="flex flex-col gap-3">
        <h2 class="text-xl font-semibold">Qué pasa con una petición</h2>
        <ol class="flex flex-col gap-4">
          @for (step of flow; track step.title; let i = $index) {
            <li class="flex gap-3">
              <span
                aria-hidden="true"
                class="grid size-7 shrink-0 place-items-center rounded-full border border-line bg-surface font-mono text-xs font-semibold"
              >
                {{ i + 1 }}
              </span>
              <div>
                <h3 class="font-semibold leading-snug">{{ step.title }}</h3>
                <p class="text-sm leading-relaxed text-muted">{{ step.detail }}</p>
              </div>
            </li>
          }
        </ol>
      </div>
    </section>
  `,
})
export class Architecture {
  protected readonly modes = MODES;
  protected readonly common = COMMON_RESOURCES;
  protected readonly flow = REQUEST_FLOW;
  protected readonly mode = signal<DnsMode>('route53');
  protected readonly current = computed(() => this.modes.find((m) => m.id === this.mode()) ?? this.modes[0]);
}
