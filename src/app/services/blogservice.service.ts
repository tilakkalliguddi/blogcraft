import { Injectable, effect, inject, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './authservice.service';
import { SnackBarService } from './snackbarservice';

export type TBlog = {
  id: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[];
  comments: { text: string }[];
  createdBy: string | null;
};

@Injectable({
  providedIn: 'root',
})
export class blogService {
  private storageKey = 'blogs';
  private snackBarService = inject(SnackBarService)
  private authService = inject(AuthService)

  data = signal<TBlog[]>(this.getBlogsFromLS());

  constructor() {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data()));
    });
  }

  getBlogsFromLS(): TBlog[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  saveBlog(blog: TBlog) {
    this.updateData([...this.data(), { ...blog, id: uuidv4() }]);
  }

  editBlog(updatedBlog: TBlog) {
    this.updateData(
      this.data().map(
        blog => (blog.id === updatedBlog.id ? updatedBlog : blog))
    );
  }

  removeBlog(id: string) {
    this.updateData(
      this.data().filter(blog => blog.id !== id)
    );
  }

  addLike(id: string) {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.snackBarService.show('Please logIn to like the blog.');
      return;
    }
    this.updateBlogField(id, blog => {
      if (blog.likedBy.includes(currentUser)) {
        this.snackBarService.show('You have already liked this blog.');
        return {};
      }
      return {
        likes: blog.likes + 1,
        likedBy: [...blog.likedBy, currentUser],
      };
    });
  }

  addComment(id: string, commentText: string) {
    this.updateBlogField(id, blog => ({
      comments: [...blog.comments, { text: commentText }],
    }));
  }

  private updateData(newData: TBlog[]) {
    this.data.set(newData);
  }

  private updateBlogField(id: string, updateFn: (blog: TBlog) => Partial<TBlog>) {
    this.updateData(
      this.data().map(blog =>
        blog.id === id ? { ...blog, ...updateFn(blog) } : blog
      )
    );
  }
}
