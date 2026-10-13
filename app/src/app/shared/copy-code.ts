import { Component, OnDestroy, input, signal } from '@angular/core';

@Component({
  selector: 'app-copy-code',
  template: `
    <div class="relative rounded-lg border border-line bg-surface">
      <pre
        class="overflow-x-auto p-4 pr-24 font-mono text-sm leading-relaxed"
      ><code>{{ code() }}</code></pre>
      <button
        type="button"
        class="absolute right-2 top-2 rounded-md border border-line bg-bg px-3 py-1 text-xs font-medium hover:border-accent focus-visible:outline-2 focus-visible:outline-accent"
        (click)="copy()"
      >
        {{ copied() ? 'Copiado' : 'Copiar' }}
      </button>
    </div>
  `,
})
export class CopyCode implements OnDestroy {
  readonly code = input.required<string>();
  protected readonly copied = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected async copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.code());
      this.copied.set(true);
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.copied.set(false), 1600);
    } catch {
      // Sin permiso de portapapeles: el texto sigue visible para copiarlo a mano.
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }
}
