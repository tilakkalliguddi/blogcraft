import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { blogService } from '../../services/blogservice.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/authservice.service';
import { SnackBarService } from '../../services/snackbarservice';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
})
export class BlogComponent {
  route = inject(ActivatedRoute);
  blogService = inject(blogService);
  authService = inject(AuthService);
  router = inject(Router);
  private snackBarService = inject(SnackBarService);

  blog = computed(() => {
    const blogId = this.route.snapshot.paramMap.get('id');
    return this.blogService.data().find((b) => b.id === blogId);
  });

  isCreator = computed(() => {
    const currentUser = this.authService.currentUser();
    return this.blog()?.createdBy === currentUser;
  });

  onDelete(id: string) {
    if (this.isCreator()) {
      const blog = this.blogService.data().find((b) => b.id === id);
      if (confirm('Are you sure you want to delete this blog?')) {
        this.blogService.removeBlog(id);
        this.snackBarService.show('The blog is deleted!');
        this.router.navigate(['/home']);
      }
    }
  }

  onEdit(id: string) {
    if (this.isCreator()) {
      const blog = this.blogService.data().find((b) => b.id === id);
      this.router.navigate(['edit', id]);
    }
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
  backToHome() {
    this.router.navigate(['/home']);
  }
}
