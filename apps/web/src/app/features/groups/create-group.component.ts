import { Component, inject, signal, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SecretSantaService, Group } from '../../core/services/secret-santa.service';

@Component({
  selector: 'app-create-group',
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-2 pb-6">

      <div class="mb-8 text-center md:text-left">
        <h2 class="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
          {{ editMode() ? 'Editar Grupo' : 'Criar Novo Grupo' }}
        </h2>
        <p class="text-slate-500 mt-2">{{ editMode() ? 'Atualize os dados do seu grupo.' : 'Configure os detalhes do seu Amigo Secreto.' }}</p>
      </div>

      @if (erro()) {
        <div class="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl font-medium">{{ erro() }}</div>
      }

      <div class="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-6 md:p-10">
        <form [formGroup]="groupForm" (ngSubmit)="onSubmit()" class="space-y-6">

          <!-- Nome -->
          <div>
            <label for="name" class="block text-sm font-bold text-slate-700 mb-2">
              Nome do Grupo <span class="text-red-500">*</span>
            </label>
            <input type="text" id="name" formControlName="name" placeholder="Ex: Natal da Família"
                   class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all text-lg font-medium"
                   [class.border-red-300]="isInvalid('name')">
            @if (isInvalid('name')) {
              <p class="text-red-500 text-sm mt-2 font-semibold">O nome do grupo é obrigatório (mín. 3 caracteres).</p>
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Data do Sorteio -->
            <div>
              <label for="drawDate" class="block text-sm font-bold text-slate-700 mb-2">
                Data do Sorteio <span class="text-red-500">*</span>
              </label>
              <input type="date" id="drawDate" formControlName="drawDate"
                     class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all text-lg font-medium"
                     [class.border-red-300]="isInvalid('drawDate')">
              @if (isInvalid('drawDate')) {
                <p class="text-red-500 text-sm mt-2 font-semibold">Defina uma data válida.</p>
              }
            </div>

            <!-- Valor sugerido -->
            <div>
              <label for="budgetLimit" class="block text-sm font-bold text-slate-700 mb-2">Valor Base do Presente</label>
              <div class="relative">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">R$</span>
                <input type="number" id="budgetLimit" formControlName="budgetLimit" placeholder="0.00" step="0.01" min="0"
                       class="w-full pl-14 pr-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all text-lg font-medium">
              </div>
            </div>
          </div>

          <!-- Status (só no edit) -->
          @if (editMode()) {
            <div>
              <label for="status" class="block text-sm font-bold text-slate-700 mb-2">Status</label>
              <select id="status" formControlName="status"
                      class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all text-lg font-medium">
                <option value="Pendente">Pendente</option>
                <option value="Ativo">Ativo</option>
                <option value="Concluido">Concluído</option>
              </select>
            </div>
          }

          <!-- Ações -->
          <div class="pt-4 flex flex-col sm:flex-row justify-end gap-4">
            <button type="button" (click)="goBack()"
                    class="order-2 sm:order-1 px-8 py-4 w-full sm:w-auto rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-colors text-lg">
              Cancelar
            </button>
            <button type="submit" [disabled]="groupForm.invalid || salvando()"
                    class="order-1 sm:order-2 px-10 py-4 w-full sm:w-auto rounded-2xl bg-purple-600 text-white font-extrabold shadow-md hover:bg-purple-700 hover:shadow-lg hover:-translate-y-0.5 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all active:scale-95 text-lg">
              @if (salvando()) { Salvando... } @else { {{ editMode() ? 'Salvar Alterações' : 'Criar Grupo' }} }
            </button>
          </div>
        </form>
      </div>

    </div>
  `
})
export class CreateGroupComponent implements OnInit {
  private fb      = inject(FormBuilder);
  private router  = inject(Router);
  private service = inject(SecretSantaService);

  id = input<string>(); // Captures the optional route parameter 'id' automatically

  editMode  = signal(false);
  salvando  = signal(false);
  erro      = signal('');

  groupForm: FormGroup = this.fb.group({
    name:        ['', [Validators.required, Validators.minLength(3)]],
    drawDate:    ['', [Validators.required]],
    budgetLimit: [null, [Validators.min(0)]],
    status:      ['Pendente']
  });

  async ngOnInit() {
    const groupId = this.id();
    if (groupId) {
      this.editMode.set(true);
      // Preenche o formulário com os dados atuais
      const group = this.service.groupsSignal()().find(g => g.id === groupId);
      if (group) {
        this.groupForm.patchValue(group);
      } else {
        // Carrega do backend se o signal ainda não foi populado
        await this.service.loadGroups();
        const g = this.service.groupsSignal()().find(x => x.id === groupId);
        if (g) this.groupForm.patchValue(g);
      }
    }
  }

  isInvalid(field: string): boolean {
    const c = this.groupForm.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  async onSubmit() {
    if (this.groupForm.invalid) { this.groupForm.markAllAsTouched(); return; }
    this.salvando.set(true);
    this.erro.set('');
    try {
      const val = this.groupForm.value;
      const groupId = this.id();
      if (this.editMode() && groupId) {
        await this.service.updateGroup(groupId, val);
        this.router.navigate(['/groups', groupId]);
      } else {
        const created = await this.service.createGroup({ ...val, status: 'Pendente' });
        this.router.navigate(['/groups', created.id]);
      }
    } catch {
      this.erro.set('Erro ao salvar. Verifique a conexão com o servidor.');
    } finally {
      this.salvando.set(false);
    }
  }

  goBack() { this.router.navigate(['/groups']); }
}
