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
          this.errorMessage.set(err.error?.message || 'Registration failed.');
          this.successMessage.set('');
        }
      });
    }
  }
}
