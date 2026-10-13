import { Component } from '@angular/core';
import { DEPLOY_COMMANDS } from '../content/commands';
import { CopyCode } from '../shared/copy-code';

@Component({
  selector: 'app-deploy',
  imports: [CopyCode],
  template: `
    <section class="flex flex-col gap-6 py-10">
      <header class="flex flex-col gap-2">
        <h1 class="text-3xl font-semibold sm:text-4xl">Despliegue de la app</h1>
        <p class="max-w-2xl text-muted">
          Con la infraestructura creada, publicar un cambio son tres comandos: construir, subir
          el <code class="font-mono text-sm">dist</code> y invalidar la caché.
        </p>
      </header>

      <ol class="flex flex-col gap-6">
        @for (command of commands; track command.title; let i = $index) {
          <li class="flex flex-col gap-2">
            <h2 class="flex items-baseline gap-2 text-lg font-semibold">
              <span class="font-mono text-sm text-muted">{{ i + 1 }}.</span>
              {{ command.title }}
            </h2>
            <p class="max-w-2xl text-sm text-muted">{{ command.description }}</p>
            <app-copy-code [code]="command.code" />
          </li>
        }
      </ol>

      <aside class="rounded-xl border border-cf bg-cf-tint p-4 text-sm leading-relaxed">
        <strong class="font-semibold text-cf">Solo para la demo:</strong>
        el bucket usa <code class="font-mono">force_destroy = true</code> para que
        <code class="font-mono">terraform destroy</code> pueda eliminarlo con el dist dentro. En un
        entorno con datos reales conviene quitarlo.
      </aside>
    </section>
  `,
})
export class Deploy {
  protected readonly commands = DEPLOY_COMMANDS;
}
