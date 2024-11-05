import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from '../navbar/navbar.component';
import { blogService } from '../../services/blogservice.service';
import { truncate } from '../../pipes/truncate.pipe';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/authservice.service';
import { SnackBarService } from '../../services/snackbarservice';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, NavbarComponent, truncate, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  blogService = inject(blogService)
  private router = inject(Router)
  private snackBarService = inject(SnackBarService)
  blogs = this.blogService.data;
  authService = inject(AuthService)

  viewBlog(id: string) {
    this.router.navigate(['blog', id])
  }

  onComment(id: string, commentInput: HTMLInputElement) {
    if (this.authService.isLoggedIn()) {
      const commentText = commentInput.value.trim();
      if (commentText) {
        this.blogService.addComment(id, commentText);
        commentInput.value = '';
      }
    } else {
      this.snackBarService.show('Please login to comment!');
    }
  }
}
