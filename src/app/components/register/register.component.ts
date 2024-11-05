import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/authservice.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SnackBarService } from '../../services/snackbarservice';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatFormFieldModule, FormsModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder)
  private snackBarService = inject(SnackBarService)
  hide = signal(true)

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]],
  })

  register() {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      const result = this.authService.register(username!, password!);
      if (result.success) {
        this.snackBarService.show(result.message);
        this.router.navigate(['/login']);
      } else {
        this.snackBarService.show(result.message);
      }
    } else {
      this.snackBarService.show('Please fill in the required fields correctly.');
    }

  }

  togglePasswordVisibility(event: MouseEvent) {
    this.hide.update(h => !h);
    event.stopPropagation();
  }

  navigateToHome() {
    this.router.navigate(['/home'])
  }
}
