import { Component, model, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative w-full">
      <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </span>
      <input type="text" [placeholder]="placeholder()"
             [(ngModel)]="value"
             class="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
    </div>
  `
})
export class SearchInputComponent {
  value = model<string>('');
  placeholder = input<string>('Buscar...');
}
