import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  imports: [FormsModule],
  template: `
    <input
      [type]="type()"
      [placeholder]="placeholder()"
      [(ngModel)]="value"
      class="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
    />
  `,
  styles: ``
})
export class TextInputComponent {
  value = model<string>('');
  placeholder = input<string>('');
  type = input<string>('text');
}
