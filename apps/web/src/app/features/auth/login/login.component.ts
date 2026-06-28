import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);

  errorMessage = signal<string | null>(null);

  async onLogin(event: Event, emailInput: HTMLInputElement, passwordInput: HTMLInputElement) {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) return;

    this.errorMessage.set(null);

    try {
      await this.supabaseService.signIn(email, password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Credenciais inválidas');
    }
  }
}

