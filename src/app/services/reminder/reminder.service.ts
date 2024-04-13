import { Injectable } from '@angular/core';
import { Reminder } from '../../model/reminder.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  maxId: number = -1;
  fakeData: Reminder[] = [];

  constructor() {
    this.fakeData = JSON.parse(localStorage.getItem('reminders') || '[]');
    this.maxId = Math.max(...this.fakeData.map(reminder => reminder.id || -1), -1) + 1;
  }

  getAllReminders(): Observable<Reminder[]> {
    return of(this.fakeData)//.pipe(delay((Math.random() * (4000 + 1000) + 3000)))
  }

  saveReminder(reminder: Reminder): Observable<Reminder[]> {
    reminder.id = this.maxId;
    this.maxId++;
    this.fakeData.push(reminder);
    localStorage.setItem('reminders', JSON.stringify(this.fakeData));
    return of(this.fakeData)//.pipe(delay((Math.random() * (4000 + 1000) + 3000)));
  }

  setReminderCompleted(reminder: Reminder): Observable<Reminder[]> {
    const index = this.fakeData.findIndex(n => n.id === reminder.id);
    if(index > -1) {
      this.fakeData[index].completed = true;
    }
    localStorage.setItem('reminders', JSON.stringify(this.fakeData));
    return of(this.fakeData)//.pipe(delay((Math.random() * (4000 + 1000) + 3000)));
  }

  deleteReminder(id: number): Observable<boolean> {
    const startLen: number = this.fakeData.length;
    this.fakeData = this.fakeData.filter(n => n.id !== id);
    if(startLen <= this.fakeData.length) return of(false);
    localStorage.setItem('reminders', JSON.stringify(this.fakeData));
    return of(true);
  }

  editReminder(editedReminder: Reminder): Observable<boolean> {
    const idx: number = this.fakeData.findIndex(n => n.id === editedReminder.id);
    if(idx === -1) return of(false);
    this.fakeData[idx] = editedReminder;
    localStorage.setItem('reminders', JSON.stringify(this.fakeData));
    return of(true)//.pipe(delay((Math.random() * (4000 + 1000) + 3000)));
  }
}
