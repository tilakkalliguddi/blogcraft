import { Router } from '@angular/router';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/authservice.service';
import { SnackBarService } from '../../services/snackbarservice';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  snackBarService = inject(SnackBarService)
  isOnCreatePage = signal<boolean>(false);
  buttonText = signal<string>('Create New');

  constructor() {
    this.router.events.subscribe(() => {
      this.updateBtnState()
    });
  }

  updateBtnState() {
    const isCreatePage = this.router.url === '/create';
    this.isOnCreatePage.set(isCreatePage);
    this.buttonText.set(isCreatePage ? 'Home' : 'Create New');
  }

  toggleRoute() {
    const targetRoute = this.isOnCreatePage() ? '/home' : '/create';
    this.router.navigateByUrl(targetRoute);
  }

  logOut() {
    if (window.confirm('Are you sure you want to log out?')) {
      this.authService.logout();
      this.router.navigate(['/home']);
      this.snackBarService.show('You are LoggedOut');
    }
  }
}
