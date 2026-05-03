import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-save-button',
  imports: [],
  template: `
    <button
      type="button"
      [disabled]="disabled() || loading()"
      (click)="onClick()"
      class="btn rounded-full bg-violet-600 hover:bg-violet-700 text-white border-none px-8 font-medium shadow-sm transition-all"
      [class.opacity-70]="disabled() || loading()"
      [class.cursor-not-allowed]="disabled() || loading()"
    >
      @if (loading()) {
        <span class="loading loading-spinner loading-sm"></span>
        Salvando...
      } @else {
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        {{ text() }}
      }
    </button>
  `,
  styles: ``,
})
export class SaveButtonComponent {
  // Inputs baseados em Signals (Angular 17+)
  text = input<string>('Salvar');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  // Output usando a nova API de Output
  save = output<void>();

  onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.save.emit();
    }
  }
}
