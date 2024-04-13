import { Injectable } from '@angular/core';
import { Tag } from '../../model/tag.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  fakeTags: Tag[] = [];
  maxId: number = -1;

  constructor() {
    this.fakeTags = JSON.parse(localStorage.getItem('tags') || '[]');
    this.maxId = Math.max(...this.fakeTags.map(tag => tag.id || -1), -1) + 1;
  }

  getAllTags(): Observable<Tag[]> {
    return of(this.fakeTags);
  }

  saveTag(name: string, color?: string): Observable<Tag> {
    if(this.fakeTags.find(t => t.name === name)) throw new Error('Tag already exists');
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
}
