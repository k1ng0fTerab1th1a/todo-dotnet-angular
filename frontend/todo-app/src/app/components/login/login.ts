import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  username = signal('');
  password = signal('');
  errorMessage = signal('');

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(): void {
    if (this.username() && this.password()) {
      this.authService.login({ username: this.username(), password: this.password() }).subscribe({
        next: (res) => {
          this.authService.setSession(res.token);
          this.router.navigate(['/todo']);
        },
        error: (err) => {
          this.errorMessage.set('Login failed. Please check your credentials.');
        }
      });
    }
  }
}
