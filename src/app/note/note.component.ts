import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Note } from '../model/note.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { NoteFormComponent } from '../note-form/note-form.component';
import { Tag } from '../model/tag.model';

@Component({
  selector: 'app-note',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './note.component.html',
  styleUrl: './note.component.scss'
})
export class NoteComponent implements OnInit {
  
  constructor(public dialogCreateNote: MatDialog) {}
  
  @Input() note: Note;
  @Input() allTags: Tag[]
  @Output() setNoteCompleted: EventEmitter<Note> = new EventEmitter<Note>();
  @Output() editNote: EventEmitter<Note> = new EventEmitter<Note>();
  @Output() deleteNote: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(): void {}

  onSetNoteCompleted() {
    this.setNoteCompleted?.emit(this.note);
  }

  onEditNote(note: Note) {
    const dialogRef = this.dialogCreateNote.open(NoteFormComponent, { data: { note: {...note}, allTags: this.allTags } });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.editNote.emit(result);
      }
    })
  }

  onDeleteNote(id: number) {
    this.deleteNote.emit(id);
  }

  isDeadlineClose(note: Note) {
    return note.dueDate && !note.completed && new Date().setDate(new Date().getDate() + 3) >= new Date(note.dueDate).getTime()
  }
}
