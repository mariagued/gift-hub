import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (group(); as g) {
      <div class="space-y-6">
        
        <!-- Cabeçalho / Título e Resumo -->
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 class="text-3xl font-extrabold text-slate-800">{{ g.name }}</h2>
            <div class="flex items-center text-slate-500 mt-2 gap-2 text-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span class="font-medium">Sorteio: {{ g.drawDate }}</span>
            </div>
          </div>
          
          <div class="flex gap-4 p-4 bg-slate-50 rounded-2xl w-full md:w-auto text-center divide-x divide-slate-200">
            <div class="px-2">
              <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Total</p>
              <p class="text-2xl font-bold text-slate-800">{{ totalParticipants() }}</p>
            </div>
            <div class="px-2">
              <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Confirmados</p>
              <p class="text-2xl font-bold text-green-600">{{ confirmed() }}</p>
            </div>
            <div class="px-2">
              <p class="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Pendentes</p>
              <p class="text-2xl font-bold text-orange-500">{{ pending() }}</p>
            </div>
          </div>
        </div>

        <!-- Barra de Ações (Busca e Convidar) -->
        <div class="flex flex-col md:flex-row justify-between gap-4 items-center">
          <!-- Campo de Busca -->
          <div class="relative w-full md:w-96">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input type="text" placeholder="Buscar por nome ou status..." 
                   [(ngModel)]="termoBusca"
                   class="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
          </div>

          <button (click)="convidarAmigo()" class="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl shadow-sm hover:bg-purple-700 hover:shadow-md transition-all active:scale-95">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
            + Convidar Amigo
          </button>
        </div>

        <!-- Grid de Participantes -->
        <h3 class="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Aba: Participantes</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (user of participantesFiltrados(); track user.id) {
            <div class="bg-white rounded-2xl shadow-sm p-4 border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <!-- Avatar (Fake Initials) -->
              <div class="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-lg flex-shrink-0">
                {{ user.name.charAt(0) }}
              </div>
              
              <div class="flex-1 overflow-hidden">
                <h4 class="font-bold text-slate-800 truncate" title="{{ user.name }}">{{ user.name }}</h4>
                <p class="text-xs font-semibold mt-1" [ngClass]="user.status === 'Confirmado' ? 'text-green-600' : 'text-orange-500'">
                  {{ user.status }}
                </p>
              </div>
            </div>
          }
        </div>

      </div>
    } @else {
      <!-- Fallback / Loading State -->
      <div class="flex flex-col items-center justify-center h-64 space-y-4">
        <div class="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p class="text-slate-500 font-medium animate-pulse">Carregando detalhes do grupo...</p>
      </div>
    }
  `
})
export class GroupDetailsComponent {
  group = signal<{name: string, drawDate: string} | null>(null);

  participants = signal([
    { id: '1', name: 'Alice Silva', status: 'Confirmado' },
    { id: '2', name: 'Bruno Souza', status: 'Confirmado' },
    { id: '3', name: 'Carlos Andrade', status: 'Pendente' },
    { id: '4', name: 'Daniela Lima', status: 'Confirmado' },
    { id: '5', name: 'Eduardo Martins', status: 'Pendente' },
  ]);

  totalParticipants = signal(5);
  confirmed = signal(3);
  pending = signal(2);

  termoBusca = signal('');
  
  participantesFiltrados = computed(() => {
    const termo = this.termoBusca().toLowerCase();
    const lista = this.participants();
    if (!termo) return lista;
    
    return lista.filter(user => 
      user.name.toLowerCase().includes(termo) || 
      user.status.toLowerCase().includes(termo)
    );
  });

  convidarAmigo() {
    alert("Link de convite copiado para a área de transferência! Compartilhe com seus amigos.");
  }

  // Simulando carregamento de API
  constructor() {
    setTimeout(() => {
      this.group.set({
        name: 'Família 2024',
        drawDate: '20 de Dezembro de 2024'
      });
    }, 1000);
  }
}
