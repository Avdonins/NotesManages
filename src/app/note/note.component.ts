import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Note } from '../model/note.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { PopupFormComponent } from '../popup-form/popup-form.component';
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
  @Output() setNoteRendered: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('noteElement') noteElement: ElementRef;

  ngOnInit(): void {
    this.setNoteRendered.emit();
  }

  onSetNoteCompleted() {
    this.noteElement.nativeElement.classList.add('completed');
    this.setNoteCompleted?.emit(this.note);
  }

  onEditNote(note: Note) {
    const dialogRef = this.dialogCreateNote.open(PopupFormComponent, { data: { note: {...note}, allTags: this.allTags, mode: 'note' } });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.editNote.emit(result);
      }
    })
  }

  onDeleteNote(id: number) {
    this.deleteNote.emit(id);
  }
}
