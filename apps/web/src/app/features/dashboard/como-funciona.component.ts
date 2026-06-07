import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-como-funciona',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-12 py-12 px-6 lg:px-8">
      <!-- Navegação de volta -->
      <div>
        <a routerLink=".." class="inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 font-semibold transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
             <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </a>
      </div>

      <!-- Título Principal -->
      <div class="text-center space-y-4">
        <h1 class="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">Como funciona o <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">GiftHub?</span></h1>
        <p class="text-lg text-slate-500 max-w-2xl mx-auto">Tudo o que você precisa saber para realizar sorteios justos, divertidos e sem dor de cabeça.</p>
      </div>

      <!-- Grid de Explicação -->
      <div class="space-y-8 relative">
        <div class="absolute left-6 top-8 bottom-8 w-0.5 bg-purple-100 hidden md:block"></div>

        <!-- Section 1 -->
        <div class="flex flex-col md:flex-row gap-6 relative">
          <div class="hidden md:flex flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full items-center justify-center border-4 border-white z-10 shadow-sm relative left-0">
             <span class="text-purple-700 font-bold text-xl">1</span>
          </div>
          <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex-1">
            <h3 class="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <svg class="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              Crie seu grupo e defina as regras
            </h3>
            <p class="text-slate-600 leading-relaxed text-lg">
              Você pode criar um grupo rapidamente. Escolha um nome, defina a data da revelação e estabeleça o valor do presente. Após isso, basta copiar o link de convite e enviar no WhatsApp da galera.
            </p>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="flex flex-col md:flex-row gap-6 relative">
          <div class="hidden md:flex flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full items-center justify-center border-4 border-white z-10 shadow-sm relative left-0">
             <span class="text-purple-700 font-bold text-xl">2</span>
          </div>
          <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex-1">
            <h3 class="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <svg class="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
              Sorteio 100% justo e automático
            </h3>
            <p class="text-slate-600 leading-relaxed text-lg">
              Na data escolhida pelo administrador, o nosso sistema roda um algoritmo avançado e seguro de Amigo Secreto. Você não precisa se preocupar com repetições e garantimos que ninguém vai tirar a si mesmo!
            </p>
          </div>
        </div>

        <!-- Section 3 -->
        <div class="flex flex-col md:flex-row gap-6 relative">
          <div class="hidden md:flex flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full items-center justify-center border-4 border-white z-10 shadow-sm relative left-0">
             <span class="text-purple-700 font-bold text-xl">3</span>
          </div>
          <div class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex-1">
            <h3 class="text-2xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <svg class="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
              Lista de desejos e Chat Anônimo
            </h3>
            <p class="text-slate-600 leading-relaxed text-lg">
              Ao descobrir o seu par, você poderá visualizar três opções de presentes desejados por ele. Além disso, vocês podem trocar mensagens criptografadas para dar "dicas" ou investigar gostos sem estragar a surpresa!
            </p>
          </div>
        </div>
      </div>
      
      <!-- CTA Footer -->
      <div class="bg-purple-50 rounded-3xl p-10 mt-12 text-center">
        <h4 class="text-2xl font-bold text-slate-800 mb-6">Pronto para criar o seu sorteio?</h4>
        <a routerLink="/groups/new" class="inline-block px-8 py-4 bg-purple-600 text-white font-bold rounded-2xl shadow-xl hover:bg-purple-700 hover:-translate-y-1 transition-all">
          Começar agora mesmo
        </a>
      </div>

    </div>
  `
})
export class ComoFuncionaComponent {}
