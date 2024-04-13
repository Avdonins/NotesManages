import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Note } from '../../model/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  maxId: number = -1;
  fakeData: Note[] = [];

  constructor() {
    this.fakeData = JSON.parse(localStorage.getItem('notes') || '[]');
    this.maxId = Math.max(...this.fakeData.map(note => note.id || -1), -1) + 1;
  }

  // Imitation of fetching server
  getAllNotes(): Observable<Note[]> {
    return of(this.fakeData)//.pipe(delay((Math.random() * (4000 + 1000) + 3000)))
  }

  saveNote(note: Note): Observable<Note[]> {
    note.id = this.maxId;
    this.maxId++;
    this.fakeData.push(note);
    localStorage.setItem('notes', JSON.stringify(this.fakeData));
    return of(this.fakeData)//.pipe(delay((Math.random() * (4000 + 1000) + 3000)));
  }

  setNoteCompleted(note: Note): Observable<Note[]> {
    const index = this.fakeData.findIndex(n => n.id === note.id);
    if(index > -1) {
      this.fakeData[index].completed = true;
    }
    localStorage.setItem('notes', JSON.stringify(this.fakeData));
    return of(this.fakeData)//.pipe(delay((Math.random() * (4000 + 1000) + 3000)));
  }

  deleteNote(id: number): Observable<boolean> {
    const startLen: number = this.fakeData.length;
    this.fakeData = this.fakeData.filter(n => n.id !== id);
    if(startLen <= this.fakeData.length) return of(false);
    localStorage.setItem('notes', JSON.stringify(this.fakeData));
    return of(true);
  }

  editNote(editedNote: Note): Observable<boolean> {
    const idx: number = this.fakeData.findIndex(n => n.id === editedNote.id);
    if(idx === -1) return of(false);
    this.fakeData[idx] = editedNote;
    localStorage.setItem('notes', JSON.stringify(this.fakeData));
    return of(true)//.pipe(delay((Math.random() * (4000 + 1000) + 3000)));
  }
}
