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

  onRegister(event: Event) {
    event.preventDefault();
    // For demonstration, navigate to login after successful registration
    this.router.navigate(['/login']);
  }
}
