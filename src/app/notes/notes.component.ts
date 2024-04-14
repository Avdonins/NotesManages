import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NoteComponent } from '../note/note.component';
import { CommonModule } from '@angular/common';
import { Note } from '../model/note.model';
import { Tag } from '../model/tag.model';
import { NoteService } from '../services/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupFormComponent } from '../popup-form/popup-form.component';
import { MatIconModule } from '@angular/material/icon';
import { TagService } from '../services/tag/tag.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [NoteComponent, CommonModule, MatIconModule],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent implements OnInit {
  currentCategory: 'Upcoming' | 'Completed' = 'Upcoming';
  allNotes: Note[] = [];
  allTags: Tag[] = [];
  isLoading: boolean = false;
  isEmpty: boolean = true;

  @Output() setNotes: EventEmitter<Note[]> = new EventEmitter<Note[]>();

  constructor(
    private notesService: NoteService,
    private tagService: TagService,
    public dialogCreateNote: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.notesService.getAllNotes().subscribe((notes) => {
      this.allNotes = notes;
      this.setNotes.emit(this.allNotes);
    }).add(() => {
      this.tagService.getAllTags().subscribe((tags) => {
        this.allTags = tags;
        this.isLoading = false;
      })
    })
  }
  
  openCreateNoteDialog() {
    const dialogRef = this.dialogCreateNote.open(PopupFormComponent, { data: { note: {}, allTags: this.allTags, mode: 'note' } });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.notesService.saveNote(result).subscribe((data) => {
          this.allNotes = data;
        })
      }
    })
  }

  editNote(note: Note) {
    this.notesService.editNote(note).subscribe((response: boolean) => {
      if(!response) alert('Error!');
    })
  }

  deleteNote(id: number) {
    this.notesService.deleteNote(id).subscribe((response: boolean) => {
      if(!response) {
        alert('Error!');
        return;
      } else {
        this.allNotes = this.allNotes.filter(note => note.id !== id)
      }
    })
  }

  onCurrentCategoryChange(category: 'Upcoming' | 'Completed') {
    if(this.currentCategory === category) return;
    this.isEmpty = true;
    this.currentCategory = category;
  }

  setNoteRendered() {
    if(this.isEmpty) {
      setTimeout(() => this.isEmpty = false);
    }
  }
}
