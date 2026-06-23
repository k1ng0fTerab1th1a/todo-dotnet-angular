import { Component, signal, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated = this.authService.isAuthenticated;
  isCollapsed = signal(true);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleNavbar(): void {
    this.isCollapsed.update(v => !v);
  }
}
