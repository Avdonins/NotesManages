import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Note } from '../../model/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor() {}

  // Imitation of fetching server
  getAllTasks(): Observable<Note[]> {
    const fakeRespone: Note[] = JSON.parse(localStorage.getItem('notes') || '[]');
    return of(fakeRespone).pipe(delay((Math.random() * (4000 + 1000) + 3000)))
  }
}
