import { Injectable } from '@angular/core';
import { Tag } from '../../model/tag.model';
import { Observable, of, throwError } from 'rxjs';
import { NoteService } from '../note/note.service';
import { ReminderService } from '../reminder/reminder.service';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  fakeTags: Tag[] = [];
  maxId: number = -1;

  constructor(
    private noteService: NoteService,
    private reminderService: ReminderService
  ) {
    this.fakeTags = JSON.parse(localStorage.getItem('tags') || '[]');
    this.maxId = Math.max(...this.fakeTags.map(tag => tag.id || -1), -1) + 1;
  }

  getAllTags(): Observable<Tag[]> {
    return of(this.fakeTags);
  }

  saveTag(name: string, color?: string): Observable<Tag> {
    if(this.fakeTags.find(t => t.name === name)) return throwError('Tag already exists');
    const tag: Tag = {
      id: this.maxId,
      name,
      color: color || null 
    }
    this.maxId++;
    this.fakeTags.push(tag);
    localStorage.setItem('tags', JSON.stringify(this.fakeTags));
    return of(tag)//.pipe(delay((Math.random() * (4000 + 1000) + 3000)));
  }

  deleteTag(tagId: number) {
    this.fakeTags = this.fakeTags.filter(tag => tag.id !== tagId);
    localStorage.setItem('tags', JSON.stringify(this.fakeTags));
    this.noteService.deleteTag(tagId);
    this.reminderService.deleteTag(tagId);
  }
}
