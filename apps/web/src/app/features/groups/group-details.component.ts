import { Component, signal, computed, inject, effect, input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SecretSantaService, Participant, MatchPair } from '../../core/services/secret-santa.service';
import { SearchInputComponent } from '../../shared/components/search-input/search-input.component';

@Component({
  selector: 'app-group-details',
  imports: [RouterLink, ReactiveFormsModule, SearchInputComponent],
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

        <form [formGroup]="participantForm" (ngSubmit)="adicionarParticipante()" class="flex flex-col sm:flex-row gap-3 items-start w-full">
          <div class="w-full sm:flex-1">
            <input type="text" formControlName="name" placeholder="Nome do participante *"
                   class="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                   [class.border-red-500]="isInvalid('name')">
            @if (isInvalid('name')) {
              <p class="text-red-500 text-xs mt-1 font-semibold ml-1">O nome é obrigatório (mín. 2 caracteres).</p>
            }
          </div>
          <div class="w-full sm:flex-1">
            <input type="email" formControlName="email" placeholder="E-mail (opcional)"
                   class="w-full px-5 py-3 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
                   [class.border-red-500]="isInvalid('email')">
            @if (isInvalid('email')) {
              <p class="text-red-500 text-xs mt-1 font-semibold ml-1">Insira um e-mail válido.</p>
            }
          </div>
          <button type="submit"
                  [disabled]="participantForm.invalid || salvando()"
                  class="w-full sm:w-auto px-7 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm h-[52px]">
            @if (salvando()) { Salvando... } @else { + Adicionar }
          </button>
        </form>
      </div>

      <!-- Barra de busca + botão sorteio -->
      <div class="flex flex-col md:flex-row justify-between gap-4 items-center">
        <div class="relative w-full md:w-96">
          <app-search-input [(value)]="termoBusca" placeholder="Buscar por nome ou e-mail..." />
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
        <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center space-y-6">
          <div class="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-600">
            <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.746 3.746 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0114 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-slate-800">🎉 Sorteio Realizado!</h3>
            <p class="text-slate-500 mt-2 max-w-md mx-auto">Os pares de amigo secreto deste grupo foram gerados de forma aleatória e segura. Cada participante pode ver quem tirou.</p>
          </div>
          <div class="flex justify-center pt-2">
            <a [routerLink]="['/groups', id(), 'revelacao']"
               class="px-8 py-4 bg-pink-600 text-white font-extrabold rounded-2xl shadow-md hover:bg-pink-700 hover:shadow-lg transition-all active:scale-95 flex items-center gap-3 text-lg">
              🔍 Ver Meu Amigo Secreto
            </a>
          </div>
        </div>
      }

    </div>
  `
})
export class GroupDetailsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(SecretSantaService);

  id = input<string>(''); // Captures the 'id' parameter from the route automatically

  participants = this.service.participantsSignal();
  matches = this.service.matchesSignal();

  participantForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.email]]
  });

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

  constructor() {
    effect(() => {
      console.log(`[GroupDetails] Total de participantes: ${this.totalParticipants()}`);
    });
  }

  async ngOnInit() {
    try {
      await this.service.loadParticipants(this.id());
      await this.service.loadMatches(this.id());
    } finally {
      this.carregando.set(false);
    }
  }

  isInvalid(field: string): boolean {
    const control = this.participantForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  async adicionarParticipante() {
    if (this.participantForm.invalid) {
      this.participantForm.markAllAsTouched();
      return;
    }
    this.erro.set('');
    this.salvando.set(true);
    try {
      const { name, email } = this.participantForm.value;
      const novo: Participant = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email ? email.trim() : undefined,
        groupId: this.id()
      };
      await this.service.addParticipant(novo);
      this.participantForm.reset({ name: '', email: '' });
    } catch {
      this.erro.set('Erro ao salvar. Verifique se a conexão está ativa.');
    } finally {
      this.salvando.set(false);
    }
  }

  async realizarSorteio() {
    this.sorteando.set(true);
    this.erro.set('');
    try {
      const pares: MatchPair[] = this.service.generateMatches(this.participants(), this.id());
      await this.service.saveMatches(pares);
    } catch (e: unknown) {
      this.erro.set(e instanceof Error ? e.message : 'Erro ao realizar sorteio.');
    } finally {
      this.sorteando.set(false);
    }
  }
}

