import { Component, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { MatButtonModule } from '@angular/material/button';
import { blogService } from '../../services/blogservice.service';
import { TBlog } from '../../services/blogservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../services/snackbarservice';
import { AuthService } from '../../services/authservice.service';

@Component({
  selector: 'app-creation',
  standalone: true,
  imports: [
    NavbarComponent,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})
export class CreationComponent implements OnInit {

  isEditMode: boolean = false;
  blogId: string | null = null;
  private fb = inject(FormBuilder);
  private service = inject(blogService);
  private router = inject(Router);
  private snackBarService = inject(SnackBarService)
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService)

  blogForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id')
    if (this.blogId) {
      const blog = this.service.data().find((b) => b.id === this.blogId)
      if (blog) {
        this.isEditMode = true;
        this.blogForm.patchValue({
          title: blog.title,
          content: blog.content
        })
      }
    }
  }

  onSave() {
    if (this.blogForm.invalid) {
      this.snackBarService.show('Please fill all the fields.');
      return;
    }
    const blogData: TBlog = {
      id: this.isEditMode ? this.blogId! : uuidv4(),
      title: this.blogForm.value.title!,
      content: this.blogForm.value.content!,
      likes: this.isEditMode ? this.getExistingBlogLikes() : 0,
      likedBy: this.isEditMode ? this.getExistingBlogLikedBy() : [],
      comments: this.isEditMode ? this.getExistingBlogComments() : [],
      createdBy: this.authService.currentUser(),
    };
    if (this.isEditMode) {
      this.service.editBlog(blogData)
      this.snackBarService.show('Blog successfully edited.');
    } else {
      this.service.saveBlog(blogData)
      this.snackBarService.show('Blog successfully created.');
    }
    this.blogForm.reset();
    this.onCancel()
  }

  onCancel() {
    this.router.navigate(['/home']);
  }
  private getExistingBlogLikes(): number {
    return this.service.data().find(b => b.id === this.blogId)?.likes || 0;
  }
  private getExistingBlogLikedBy(): string[] {
    return this.service.data().find(b => b.id === this.blogId)?.likedBy || [];
  }
  private getExistingBlogComments(): { text: string }[] {
    return this.service.data().find(b => b.id === this.blogId)?.comments || [];
  }
  
}
