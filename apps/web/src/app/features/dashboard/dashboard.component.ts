import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SecretSantaService } from '../../core/services/secret-santa.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8 md:space-y-12">
      <!-- Hero Banner Responsivo -->
      <section class="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white rounded-[2rem] p-8 md:p-14 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        
        <div class="z-10 text-center md:text-left max-w-2xl">
          <h2 class="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight tracking-tight text-white drop-shadow-sm">
            Transforme cada presente em um momento mágico.
          </h2>
          <p class="text-purple-100 mb-8 text-lg md:text-xl font-medium max-w-xl mx-auto md:mx-0">
            Crie sorteios, defina orçamentos e descubra os desejos secretos de quem você ama de forma simples e divertida.
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <a routerLink="/groups/new" class="w-full sm:w-auto text-center bg-white text-purple-700 font-bold py-4 px-8 rounded-2xl shadow-md hover:shadow-lg hover:bg-slate-50 transition-all active:scale-95 text-lg">
              + Criar Novo Grupo
            </a>
            <a [routerLink]="['/como-funciona']" class="w-full sm:w-auto text-center bg-purple-500/30 hover:bg-purple-500/50 backdrop-blur-sm border border-purple-400 text-white font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 text-lg block">
              Como Funciona
            </a>
          </div>
        </div>
        
        <!-- Elemento Decorativo (Presente/Ilustração) hidden on mobile to save space -->
        <div class="hidden lg:block z-10 w-64 h-64 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 shadow-2xl rotate-12 hover:rotate-6 transition-transform duration-500 flex-shrink-0">
          <div class="w-full h-full border-4 border-dotted border-white/40 rounded-xl flex items-center justify-center">
            <svg class="w-24 h-24 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        </div>

        <!-- Brilhos Decorativos -->
        <div class="absolute -right-20 -top-20 w-96 h-96 bg-purple-400 rounded-full blur-[100px] opacity-60"></div>
        <div class="absolute left-1/4 -bottom-32 w-80 h-80 bg-indigo-500 rounded-full blur-[100px] opacity-40"></div>
      </section>

      <!-- Meus Grupos Section -->
      <section>
        <div class="flex items-center justify-between mb-6 px-2">
          <h3 class="text-2xl md:text-3xl font-extrabold text-slate-800">Meus Grupos</h3>
          <a routerLink="/groups" class="text-purple-600 font-bold text-sm md:text-base hover:underline flex items-center gap-1">
            Ver todos <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>

        @if (carregando()) {
          <div class="flex items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div class="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        } @else if (erro()) {
          <div class="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl font-medium text-center">
            {{ erro() }}
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (group of activeGroups(); track group.id) {
              <!-- Card de Grupo Responsivo -->
              <div class="bg-white rounded-[1.5rem] shadow-sm p-6 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group focus-within:ring-2 focus-within:ring-purple-500 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-[4rem]"></div>
                
                <div class="flex justify-between items-start mb-5 relative z-10">
                  <h4 class="text-xl font-bold text-slate-800 line-clamp-1 pr-2">{{ group.name }}</h4>
                  <span class="px-3 py-1.5 text-xs font-bold rounded-full whitespace-nowrap flex-shrink-0" 
                        [class]="group.status === 'Ativo'
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : group.status === 'Concluido'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-orange-100 text-orange-700 border border-orange-200'">
                    {{ group.status }}
                  </span>
                </div>
                
                <div class="space-y-3 mb-8 relative z-10">
                  <div class="flex items-center text-slate-500 text-sm md:text-base font-medium gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                      <svg class="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    Sorteio: {{ group.drawDate }}
                  </div>
                  <div class="flex items-center text-slate-500 text-sm md:text-base font-medium gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                      <svg class="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    {{ group.participants }} participantes
                  </div>
                </div>

                @if (group.status === 'Ativo' || group.status === 'Concluido') {
                  <a [routerLink]="['/groups', group.id, 'revelacao']" class="relative z-10 block w-full text-center py-3.5 rounded-xl border-2 border-purple-600 bg-purple-600 text-white font-bold hover:bg-purple-700 hover:border-purple-700 transition-all focus:outline-none shadow-md hover:shadow-lg">
                    Ver Sorteio
                  </a>
                } @else {
                  <a [routerLink]="['/groups', group.id]" class="relative z-10 block w-full text-center py-3.5 rounded-xl border-2 border-purple-100 text-purple-700 font-bold hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all focus:outline-none">
                    Acessar Grupo
                  </a>
                }
              </div>
            } @empty {
              <div class="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm w-full">
                <div class="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg class="w-8 h-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-slate-700 mb-2">Nenhum grupo ativo</h3>
                <p class="text-slate-400 mb-6">Você ainda não possui grupos criados.</p>
                <a routerLink="/groups/new" class="px-6 py-3 bg-purple-600 text-white font-bold rounded-2xl hover:bg-purple-700 transition-all">
                  + Criar Grupo
                </a>
              </div>
            }
          </div>
        }
      </section>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private service = inject(SecretSantaService);

  groups = this.service.groupsSignal();
  participants = this.service.participantsSignal();

  carregando = signal(true);
  erro = signal('');

  activeGroups = computed(() => {
    const allGroups = this.groups();
    const allParticipants = this.participants();

    return allGroups.map(group => {
      // Conta quantos participantes pertencem a esse grupo
      const count = allParticipants.filter(p => p.groupId === group.id).length;
      
      // Formata a data de sorteio (dd/MM/yyyy) caso esteja como YYYY-MM-DD
      let formattedDate = group.drawDate;
      if (group.drawDate && group.drawDate.includes('-')) {
        try {
          const parts = group.drawDate.split('-');
          formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        } catch (e) {
          // Mantém o original
        }
      }

      return {
        id: group.id,
        name: group.name,
        drawDate: formattedDate || 'Não informada',
        participants: count,
        status: group.status
      };
    });
  });

  async ngOnInit() {
    try {
      this.carregando.set(true);
      await this.service.loadGroups();
      await this.service.loadParticipants(); // Busca todos os participantes do banco de dados
    } catch (e) {
      console.error(e);
      this.erro.set('Erro ao carregar os dados. Verifique a conexão com o servidor.');
    } finally {
      this.carregando.set(false);
    }
  }
}
