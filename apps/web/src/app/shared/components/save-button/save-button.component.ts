import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-save-button',
  standalone: true,
  template: `
    <button
      type="button"
      [disabled]="disabled() || loading()"
      (click)="onClick()"
      class="flex items-center justify-center bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-6 rounded-full shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
    >
      @if (loading()) {
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Salvando...
      } @else {
        {{ text() }}
      }
    </button>
  `
})
export class SaveButtonComponent {
  // Inputs usando a nova API de Signals do Angular
  text = input<string>('Salvar');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  
  // Output usando a nova API de Signals
  save = output<void>();

  onClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.save.emit();
    }
  }
}
