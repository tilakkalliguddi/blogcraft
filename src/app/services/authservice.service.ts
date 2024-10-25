import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storageKey = 'loggedInUser';
  isLoggedIn = signal(this.isUserLoggedIn());
  currentUser = signal<string | null>(this.getLoggedInUser());

  constructor() {
    effect(() => {
      if (this.isLoggedIn()) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.currentUser()));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    });
  }

  register(username: string, password: string): { success: boolean, message: string } {
    const users = this.getUsersFromLS();
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return { success: false, message: 'Username already exists. Please choose another one.' };
    }
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Registration successful!' };
  }

  login(username: string, password: string): boolean {
    const users = this.getUsersFromLS();
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
      this.isLoggedIn.set(true);
      this.currentUser.set(username);
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
  }

  getUsersFromLS(): { username: string, password: string }[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  isUserLoggedIn(): boolean {
    return JSON.parse(localStorage.getItem(this.storageKey) || 'false');
  }

  getLoggedInUser(): string | '' {
    return localStorage.getItem('loggedInUser') || '';
  }
}
