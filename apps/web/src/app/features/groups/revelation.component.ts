import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SecretSantaService, User } from '../../core/services/secret-santa.service';

@Component({
  selector: 'app-revelation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-2xl mx-auto space-y-8 py-8 animate-fade-in text-center px-4">
      
      <!-- Cabeçalho -->
      <div class="space-y-4">
        <h2 class="text-4xl font-extrabold text-slate-800 tracking-tight">Meu Amigo Secreto</h2>
        <p class="text-slate-500 font-medium text-lg">
          O momento tão esperado chegou! Descubra quem você vai presentear.
        </p>
      </div>

      <!-- Card de Revelação -->
      <div class="relative bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mt-8 overflow-hidden transition-all duration-500 hover:shadow-xl group">
        
        <!-- Fundo decorativo sutil -->
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 block"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-50 rounded-full blur-3xl opacity-50 block"></div>

        <div class="relative z-10 flex flex-col items-center justify-center min-h-[300px]">
          
          @if (!revelado()) {
            <!-- Estado Antes de Revelar -->
            <div class="flex flex-col items-center gap-6 animate-pulse-soft">
              <div class="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shadow-inner">
                <svg class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-slate-700">Quem será o seu par?</h3>
              
              <button 
                (click)="revelar()"
                class="mt-4 px-8 py-4 bg-purple-600 text-white font-bold rounded-full shadow-lg hover:bg-purple-700 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-xl flex items-center gap-2">
                <svg class="w-6 h-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Revelar agora
              </button>
            </div>
          } @else {
            <!-- Estado Após Revelar (com o Amigo Sorteado) -->
            @if (amigoSorteado(); as amigo) {
              <div class="flex flex-col items-center gap-6 animate-fade-in-up">
                
                <p class="text-sm font-bold text-purple-600 uppercase tracking-widest">Seu amigo secreto é</p>
                
                <div class="relative">
                  <img [src]="amigo.avatarUrl" [alt]="amigo.name" class="w-40 h-40 rounded-full object-cover shadow-2xl border-4 border-white z-10 relative">
                  <div class="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping opacity-20"></div>
                </div>

                <h3 class="text-4xl font-extrabold text-slate-800">{{ amigo.name }}</h3>

                <!-- Wishlist Section -->
                <div class="mt-4 w-full text-left bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 class="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <svg class="w-5 h-5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Lista de Desejos
                  </h4>
                  <ul class="space-y-3">
                    @for (item of amigo.wishlist; track item) {
                      <li class="flex items-center gap-3 text-slate-600 bg-white p-3 rounded-xl shadow-sm border border-slate-50">
                        <svg class="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="font-medium">{{ item }}</span>
                      </li>
                    } @empty {
                      <li class="text-sm text-slate-500 italic text-center py-2">Nenhum item na lista ainda.</li>
                    }
                  </ul>
                </div>

              </div>
            }
          }
        </div>
      </div>
      
      <!-- Navegação de volta -->
      <div class="pt-6">
        <a routerLink=".." class="inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para o Grupo
        </a>
      </div>
      
    </div>
  `,
  styles: [`
    @keyframes pulse-soft {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    .animate-pulse-soft {
      animation: pulse-soft 3s ease-in-out infinite;
    }
    @keyframes fade-in-up {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fade-in {
      animation: fade-in 0.4s ease-out;
    }
  `]
})
export class RevelationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private secretSantaService = inject(SecretSantaService);

  revelado = signal(false);
  amigoSorteado = signal<User | null>(null);
  groupId: string | null = null;

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('id');
  }

  revelar() {
    if (this.groupId) {
      // Simula um delay para efeito visual dramático (opcional)
      const data = this.secretSantaService.getMeuAmigoSorteado(this.groupId);
      this.amigoSorteado.set(data);
      this.revelado.set(true);
    }
  }
}
