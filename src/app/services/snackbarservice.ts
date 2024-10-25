import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})

export class SnackBarService {
  private snackBar = inject(MatSnackBar);

  show(message: string, action: string = '', duration: number = 2000) {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
}
