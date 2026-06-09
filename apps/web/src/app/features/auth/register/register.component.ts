import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  constructor(private router: Router) {}

  onRegister(event: Event, nameInput: HTMLInputElement, emailInput: HTMLInputElement) {
    event.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (name && email) {
      localStorage.setItem('currentUser', JSON.stringify({ name, email }));
    }
    this.router.navigate(['/login']);
  }
}
