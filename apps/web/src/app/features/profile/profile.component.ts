import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      
      <!-- Profile Header -->
      <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        <!-- Background Decor -->
        <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
        
        <div class="relative mt-12 mb-4">
          <div class="w-28 h-28 bg-white p-1 rounded-full shadow-md mx-auto">
            <div class="w-full h-full rounded-full bg-purple-100 flex items-center justify-center text-4xl font-extrabold text-purple-700">
              {{ userName().charAt(0) }}
            </div>
          </div>
          <!-- Premium Badge -->
          <div class="absolute bottom-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-extrabold px-2 py-1 rounded-full shadow-sm border-2 border-white uppercase tracking-wider">
            Premium
          </div>
        </div>

        <h2 class="text-3xl font-extrabold text-slate-800">{{ userName() }}</h2>
        <p class="text-slate-500 font-medium mt-1">{{ userEmail() }}</p>
        <p class="text-xs text-slate-400 mt-2">Membro desde: {{ memberSince() }}</p>
      </div>

      <!-- Estatísticas (Grid Cards) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
          </div>
          <p class="text-2xl font-bold text-slate-800">12</p>
          <p class="text-xs text-slate-500 font-semibold">Enviados</p>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <p class="text-2xl font-bold text-slate-800">5</p>
          <p class="text-xs text-slate-500 font-semibold">Wishlists</p>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <p class="text-2xl font-bold text-slate-800">48</p>
          <p class="text-xs text-slate-500 font-semibold">Amigos</p>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <div class="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </div>
          <p class="text-2xl font-bold text-slate-800">350</p>
          <p class="text-xs text-slate-500 font-semibold">Pontos</p>
        </div>
      </div>

      <!-- Configurações da Conta -->
      <div class="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <ul class="divide-y divide-slate-100">
          <li>
            <button class="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
              <div class="flex items-center gap-4 text-slate-700">
                <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span class="font-semibold">Notificações</span>
              </div>
              <svg class="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </li>
          <li>
            <button class="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
              <div class="flex items-center gap-4 text-slate-700">
                <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                <span class="font-semibold">Privacidade e Segurança</span>
              </div>
              <svg class="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </li>
          <li>
            <button class="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
              <div class="flex items-center gap-4 text-slate-700">
                <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span class="font-semibold">Ajuda e Suporte</span>
              </div>
              <svg class="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </li>
        </ul>
      </div>

      <!-- Logout -->
      <a routerLink="/login" class="w-full inline-block text-center bg-white text-red-600 font-bold py-4 rounded-3xl shadow-sm border border-red-100 hover:bg-red-50 transition-colors cursor-pointer">
        Sair da conta
      </a>

    </div>
  `
})
export class ProfileComponent implements OnInit {
  userName = signal('Maria Guedes');
  userEmail = signal('maria.guedes@gifthub.test');
  memberSince = signal('Janeiro de 2024');

  ngOnInit() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.name) this.userName.set(user.name);
        if (user.email) this.userEmail.set(user.email);
      } catch (e) {
        console.error('Erro ao ler usuário do localStorage:', e);
      }
    }
  }
}
