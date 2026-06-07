import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SecretSantaService, Participant, MatchPair } from '../../core/services/secret-santa.service';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="space-y-6">

      <!-- Cabeçalho -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 class="text-3xl font-extrabold text-slate-800">Detalhes do Grupo</h2>
          <p class="text-slate-500 mt-1 text-sm">Gerencie participantes e realize o sorteio.</p>
        </div>
        <div class="flex gap-4 p-4 bg-slate-50 rounded-2xl w-full md:w-auto text-center divide-x divide-slate-200">
          <div class="px-2">
            <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Total</p>
            <p class="text-2xl font-bold text-slate-800">{{ totalParticipants() }}</p>
          </div>
          <div class="px-2">
            <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Pares</p>
            <p class="text-2xl font-bold text-green-600">{{ totalMatches() }}</p>
          </div>
        </div>
      </div>

      <!-- Formulário: Adicionar Participante -->
      <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 class="text-lg font-bold text-slate-700 mb-4">Adicionar Participante</h3>

        @if (erro()) {
          <div class="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl font-medium">
            {{ erro() }}
          </div>
        }

        <div class="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder="Nome do participante *"
                 [value]="novoNome()"
                 (input)="novoNome.set($any($event.target).value)"
                 class="flex-1 px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium">
          <input type="email" placeholder="E-mail (opcional)"
                 [value]="novoEmail()"
                 (input)="novoEmail.set($any($event.target).value)"
                 class="flex-1 px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium">
          <button (click)="adicionarParticipante()"
                  [disabled]="salvando()"
                  class="px-7 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
            @if (salvando()) { Salvando... } @else { + Adicionar }
          </button>
        </div>
      </div>

      <!-- Barra de busca + botão sorteio -->
      <div class="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div class="relative w-full md:w-96">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </span>
          <input type="text" placeholder="Buscar por nome ou e-mail..."
                 [value]="termoBusca()"
                 (input)="termoBusca.set($any($event.target).value)"
                 class="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
        </div>

        <button (click)="realizarSorteio()"
                [disabled]="totalParticipants() < 3 || sorteando()"
                class="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl shadow-sm hover:bg-purple-700 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
          @if (sorteando()) { Sorteando... } @else { 🎁 Realizar Sorteio }
        </button>
      </div>

      <!-- Lista de Participantes -->
      <div>
        <h3 class="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">
          Participantes ({{ participantesFiltrados().length }})
        </h3>

        @if (carregando()) {
          <div class="flex items-center justify-center h-32">
            <div class="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        } @else if (participantesFiltrados().length === 0) {
          <div class="text-center py-12 text-slate-400">
            <p class="font-medium">Nenhum participante encontrado.</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            @for (p of participantesFiltrados(); track p.id) {
              <div class="bg-white rounded-2xl shadow-sm p-4 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div class="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-lg flex-shrink-0">
                  {{ p.name.charAt(0).toUpperCase() }}
                </div>
                <div class="flex-1 overflow-hidden">
                  <h4 class="font-bold text-slate-800 truncate" [title]="p.name">{{ p.name }}</h4>
                  @if (p.email) {
                    <p class="text-xs text-slate-400 truncate mt-0.5">{{ p.email }}</p>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Resultado do Sorteio -->
      @if (totalMatches() > 0) {
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 class="text-xl font-bold text-slate-800 mb-4">🎉 Resultado do Sorteio</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            @for (par of matches(); track par.giver.id) {
              <div class="flex items-center gap-3 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <span class="font-bold text-slate-700 flex-1 truncate">{{ par.giver.name }}</span>
                <svg class="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span class="font-bold text-purple-700 flex-1 truncate text-right">{{ par.receiver.name }}</span>
              </div>
            }
          </div>
        </div>
      }

    </div>
  `
})
export class GroupDetailsComponent implements OnInit {
  private service = inject(SecretSantaService);

  participants = this.service.participantsSignal();
  matches = this.service.matchesSignal();

  novoNome = signal('');
  novoEmail = signal('');
  termoBusca = signal('');
  carregando = signal(true);
  salvando = signal(false);
  sorteando = signal(false);
  erro = signal('');

  totalParticipants = computed(() => this.participants().length);
  totalMatches = computed(() => this.matches().length);

  participantesFiltrados = computed(() => {
    const termo = this.termoBusca().toLowerCase();
    const lista = this.participants();
    if (!termo) return lista;
    return lista.filter(p =>
      p.name.toLowerCase().includes(termo) ||
      (p.email ?? '').toLowerCase().includes(termo)
    );
  });

  async ngOnInit() {
    try {
      await this.service.loadParticipants();
      await this.service.loadMatches();
    } finally {
      this.carregando.set(false);
    }
  }

  async adicionarParticipante() {
    this.erro.set('');
    if (!this.novoNome().trim()) {
      this.erro.set('O nome do participante é obrigatório.');
      return;
    }
    this.salvando.set(true);
    try {
      const novo: Participant = {
        id: crypto.randomUUID(),
        name: this.novoNome().trim(),
        email: this.novoEmail().trim() || undefined
      };
      await this.service.addParticipant(novo);
      this.novoNome.set('');
      this.novoEmail.set('');
    } catch {
      this.erro.set('Erro ao salvar. Verifique se o json-server está rodando.');
    } finally {
      this.salvando.set(false);
    }
  }

  async realizarSorteio() {
    this.sorteando.set(true);
    this.erro.set('');
    try {
      const pares: MatchPair[] = this.service.generateMatches(this.participants());
      await this.service.saveMatches(pares);
    } catch (e: unknown) {
      this.erro.set(e instanceof Error ? e.message : 'Erro ao realizar sorteio.');
    } finally {
      this.sorteando.set(false);
    }
  }
}
