import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  username = signal('');
  password = signal('');
  errorMessage = signal('');
  successMessage = signal('');

  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(): void {
    if (this.username() && this.password()) {
      this.authService.register({ username: this.username(), password: this.password() }).subscribe({
        next: () => {
          this.successMessage.set('Registration successful! You can now log in.');
          this.errorMessage.set('');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          let msg = err.error?.message || err.error?.title || 'Registration failed.';
          if (err.error?.errors) {
            if (typeof err.error.errors === 'object' && !Array.isArray(err.error.errors)) {
              msg = Object.values(err.error.errors).flat().join(' ');
            } else if (Array.isArray(err.error.errors)) {
              msg = err.error.errors.join(' ');
            }
          } else if (err.error?.detail) {
            msg = err.error.detail;
          }
          this.errorMessage.set(msg);
          this.successMessage.set('');
        }
      });
    }
  }
}
