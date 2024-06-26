import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackbar: MatSnackBar) { }

  showSnackbar(message: string) {
    this.snackbar.open(message, undefined, {
      duration: 2000
    });
  }
}
