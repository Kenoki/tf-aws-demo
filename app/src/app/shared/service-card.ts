import { Component, input } from '@angular/core';
import { Service } from '../content/services';

@Component({
  selector: 'app-service-card',
  template: `
    <article class="flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-5">
      <header class="flex items-center gap-3">
        @if (service().icon; as icon) {
          <img [src]="icon" alt="" width="40" height="40" class="size-10 shrink-0 rounded" />
        } @else {
          <span
            aria-hidden="true"
            class="grid size-10 shrink-0 place-items-center rounded bg-line/40 text-sm font-semibold text-muted"
          >
            {{ service().name.charAt(0) }}
          </span>
        }
        <div class="min-w-0">
          <h3 class="text-base font-semibold leading-tight">{{ service().name }}</h3>
          <p class="text-sm text-muted">{{ service().role }}</p>
        </div>
      </header>
      <p class="text-sm leading-relaxed">{{ service().description }}</p>
      <ul class="mt-auto flex flex-wrap gap-1.5 pt-1">
        @for (resource of service().terraform; track resource) {
          <li class="rounded bg-line/30 px-2 py-0.5 font-mono text-xs text-muted">
            {{ resource }}
          </li>
        }
      </ul>
    </article>
  `,
})
export class ServiceCard {
  readonly service = input.required<Service>();
}
