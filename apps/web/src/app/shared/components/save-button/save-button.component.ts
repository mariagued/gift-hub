import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-save-button',
  standalone: true,
  template: `
    <button
      type="button"
      [disabled]="disabled() || loading()"
      (click)="onClick()"
      class="btn btn-primary rounded-full px-8 text-white shadow-md transition-transform active:scale-95"
    >
      @if (loading()) {
        <span class="loading loading-spinner loading-sm"></span>
        Salvando...
      } @else {
        {{ text() }}
      }
    </button>
  `
})
export class SaveButtonComponent {
  // Inputs usando a nova API de Signals do Angular (v17+)
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
