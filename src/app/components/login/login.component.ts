import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/authservice.service';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../../services/snackbarservice';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, FormsModule, MatButtonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBarService = inject(SnackBarService)
  private fb = inject(FormBuilder)

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  })

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const logInSuccess = this.authService.login(username!, password!)

      if (logInSuccess) {
        this.snackBarService.show('You are logedIn Successfully!');
        this.router.navigate(['/home']);
      } else {
        this.snackBarService.show('Invalid username or password!');
      }
    } else {
      this.snackBarService.show('Invalid credentials!');
    }
  }

  backToHome() {
    this.router.navigate(['/home'])
  }

  hide = signal(true);
  togglePasswordVisibility(event: MouseEvent) {
    this.hide.update(h => !h);
    event.stopPropagation();
  }
}
