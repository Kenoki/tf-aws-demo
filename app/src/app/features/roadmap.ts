import { Component } from '@angular/core';
import { ROADMAP, RoadmapStatus, STATUS_LABEL } from '../content/roadmap';

@Component({
  selector: 'app-roadmap',
  template: `
    <section class="flex flex-col gap-6 py-10">
      <header class="flex flex-col gap-2">
        <h1 class="text-3xl font-semibold sm:text-4xl">Roadmap</h1>
        <p class="max-w-2xl text-muted">
          Es un proyecto en evolución. Esto está hecho y esto es lo que sigue.
        </p>
      </header>

      <ul class="flex flex-col gap-3">
        @for (item of items; track item.title) {
          <li class="flex flex-col gap-1 rounded-xl border border-line bg-surface p-4 sm:flex-row sm:items-start sm:gap-4">
            <span
              class="w-fit shrink-0 rounded px-2 py-0.5 text-xs font-semibold sm:mt-0.5"
              [class]="badge(item.status)"
            >
              {{ label[item.status] }}
            </span>
            <div>
              <h2 class="font-semibold leading-snug">{{ item.title }}</h2>
              <p class="text-sm leading-relaxed text-muted">{{ item.detail }}</p>
            </div>
          </li>
        }
      </ul>
    </section>
  `,
})
export class Roadmap {
  protected readonly items = ROADMAP;
  protected readonly label = STATUS_LABEL;

  protected badge(status: RoadmapStatus): string {
    switch (status) {
      case 'hecho':
        return 'bg-aws-tint text-aws';
      case 'siguiente':
        return 'bg-cf-tint text-cf';
      default:
        return 'bg-line/40 text-muted';
    }
  }
}
