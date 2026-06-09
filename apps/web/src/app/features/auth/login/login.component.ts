import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private router: Router) {}

  async onLogin(event: Event, emailInput: HTMLInputElement) {
    event.preventDefault();
    const email = emailInput.value.trim();
    if (!email) return;

    // Default name formatting from email username
    let name = email.split('@')[0];
    name = name.charAt(0).toUpperCase() + name.slice(1);

    try {
      const res = await fetch(`${environment.apiUrl}/participants?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const matching = await res.json();
        if (matching && matching.length > 0) {
          name = matching[0].name;
        }
      }
    } catch (e) {
      console.error('Erro ao buscar participante para o login', e);
    }

    localStorage.setItem('currentUser', JSON.stringify({ name, email }));
    this.router.navigate(['/dashboard']);
  }
}
