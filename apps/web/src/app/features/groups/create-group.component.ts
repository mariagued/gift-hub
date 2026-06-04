import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [CurrencyPipe],
  template: `
    <div class="max-w-4xl mx-auto px-2 pb-6">
      
      <div class="mb-6 md:mb-10 text-center md:text-left">
        <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">Criar Novo Grupo</h2>
        <p class="text-slate-500 mt-2 md:text-lg">Chegou a hora de unir as pessoas. Configure os detalhes abaixo.</p>
      </div>

      <div class="bg-white rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row">
        
        <!-- Formulário (Lateral Esquerda no Desktop) -->
        <div class="p-6 md:p-10 flex-1 order-2 md:order-1">
          <form [formGroup]="groupForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Nome do Grupo -->
            <div>
              <label for="name" class="block text-sm font-bold text-slate-700 mb-2">Nome do Grupo <span class="text-red-500">*</span></label>
              <input type="text" id="name" formControlName="name" placeholder="Ex: Natal da Família"
                     class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all text-lg font-medium"
                     [ngClass]="{'border-red-300 ring-4 ring-red-500/10 focus:border-red-500 focus:ring-red-500/20': isFieldInvalid('name')}">
              @if (isFieldInvalid('name')) {
                <p class="text-red-500 text-sm mt-2 font-semibold">O nome do grupo é obrigatório.</p>
              }
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Data do Sorteio -->
              <div>
                <label for="drawDate" class="block text-sm font-bold text-slate-700 mb-2">Data do Sorteio <span class="text-red-500">*</span></label>
                <input type="date" id="drawDate" formControlName="drawDate"
                       class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all text-lg font-medium"
                       [ngClass]="{'border-red-300 ring-4 ring-red-500/10 focus:border-red-500 focus:ring-red-500/20': isFieldInvalid('drawDate')}">
                @if (isFieldInvalid('drawDate')) {
                  <p class="text-red-500 text-sm mt-2 font-semibold">Defina uma data válida.</p>
                }
              </div>

              <!-- Valor Sugerido -->
              <div>
                <label for="suggestedValue" class="block text-sm font-bold text-slate-700 mb-2">Valor Base do Presente</label>
                <div class="relative">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">R$</span>
                  <input type="number" id="suggestedValue" formControlName="suggestedValue" placeholder="0.00" step="0.01" min="0"
                         class="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all text-lg font-medium">
                </div>
              </div>
            </div>

            <!-- Imagem Decorativa (Aparece logo abaixo dos inputs conforme requisito Step 7) -->
            <div class="mt-8 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 relative aspect-[21/9]">
                <img src="https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&q=80&w=1200&h=400" 
                     alt="Presentes Festivos" 
                     class="absolute inset-0 w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <span class="text-white font-medium text-sm">Tema: Festas de Fim de Ano</span>
                </div>
            </div>

            <!-- Botão Submit -->
            <div class="pt-8 flex flex-col sm:flex-row justify-end gap-4">
              <button type="button" class="order-2 sm:order-1 px-8 py-4 w-full sm:w-auto rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-colors text-lg" (click)="goBack()">
                Cancelar
              </button>
              <button type="submit" [disabled]="groupForm.invalid"
                      class="order-1 sm:order-2 px-10 py-4 w-full sm:w-auto rounded-2xl bg-purple-600 text-white font-extrabold shadow-md hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5 disabled:bg-slate-300 disabled:shadow-none disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all active:scale-95 text-lg">
                Finalizar Criação
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class CreateGroupComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  groupForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    drawDate: ['', [Validators.required]],
    suggestedValue: [null, [Validators.min(0)]]
  });

  isFieldInvalid(field: string): boolean {
    const control = this.groupForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.groupForm.valid) {
      console.log('Grupo criado:', this.groupForm.value);
      this.router.navigate(['/dashboard']);
    } else {
      this.groupForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
