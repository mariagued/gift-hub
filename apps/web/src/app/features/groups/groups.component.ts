import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SecretSantaService, Group } from '../../core/services/secret-santa.service';

@Component({
  selector: 'app-groups',
  imports: [RouterLink, DatePipe],
  template: `
    <div class="space-y-6">

      <!-- Cabeçalho -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-3xl font-extrabold text-slate-800">Meus Grupos</h2>
          <p class="text-slate-500 mt-1">{{ groups().length }} grupo(s) criado(s)</p>
        </div>
        <a routerLink="/groups/new"
           class="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl shadow-sm hover:bg-purple-700 transition-all active:scale-95">
          + Criar Novo Grupo
        </a>
      </div>

      @if (erro()) {
        <div class="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl font-medium">{{ erro() }}</div>
      }

      <!-- Lista de Grupos -->
      @if (carregando()) {
        <div class="flex items-center justify-center h-48">
          <div class="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        </div>
      } @else if (groups().length === 0) {
        <div class="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div class="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-700 mb-2">Nenhum grupo ainda</h3>
          <p class="text-slate-400 mb-6">Crie seu primeiro grupo de Amigo Secreto!</p>
          <a routerLink="/groups/new" class="px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all">
            + Criar Grupo
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (group of groups(); track group.id) {
            <div class="bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">

              <!-- Topo colorido -->
              <div class="h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

              <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                  <h3 class="text-xl font-extrabold text-slate-800 leading-tight pr-2">{{ group.name }}</h3>
                  <span class="px-3 py-1 text-xs font-bold rounded-full flex-shrink-0"
                        [class]="group.status === 'Ativo'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : group.status === 'Concluido'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-orange-100 text-orange-700 border border-orange-200'">
                    {{ group.status }}
                  </span>
                </div>

                <div class="flex items-center gap-2 text-slate-400 text-sm mb-6">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ group.drawDate | date:'dd/MM/yyyy':'UTC' }}</span>
                  
                </div>

                <!-- Ações -->
                <div class="flex gap-2">
                  <a [routerLink]="['/groups', group.id]"
                     class="flex-1 text-center py-2.5 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-all active:scale-95">
                    Acessar
                  </a>
                  <a [routerLink]="['/groups', group.id, 'edit']"
                     class="px-3 py-2.5 rounded-xl border-2 border-slate-100 text-slate-500 hover:border-purple-200 hover:text-purple-600 transition-all"
                     title="Editar">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </a>
                  <button (click)="excluirGrupo(group)"
                          class="px-3 py-2.5 rounded-xl border-2 border-slate-100 text-slate-500 hover:border-red-200 hover:text-red-500 transition-all"
                          title="Excluir">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }

    </div>
  `
})
export class GroupsComponent implements OnInit {
  private service = inject(SecretSantaService);

  groups   = this.service.groupsSignal();
  carregando = signal(true);
  erro     = signal('');

  async ngOnInit() {
    try {
      await this.service.loadGroups();
    } catch {
      this.erro.set('Erro ao carregar grupos. Verifique se o json-server está rodando.');
    } finally {
      this.carregando.set(false);
    }
  }

  async excluirGrupo(group: Group) {
    if (!confirm(`Excluir o grupo "${group.name}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await this.service.deleteGroup(group.id);
    } catch {
      this.erro.set('Erro ao excluir grupo.');
    }
  }
}
