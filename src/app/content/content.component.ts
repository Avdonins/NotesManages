import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav/sidenav.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { Note } from '../model/note.model';
import { NoteService } from '../services/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { NoteFormComponent } from '../note-form/note-form.component';
import { NoteComponent } from '../note/note.component';
import { Tag } from '../model/tag.model';
import { TagService } from '../services/tag/tag.service';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [MatSidenavModule, CommonModule, MatIconModule, MatSelectModule, NoteComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit, AfterViewInit{
  dateValue: Date;
  greeting: string = '';
  selectMode: 'week' | 'month' = 'week';
  currentCategory: 'Upcoming' | 'Overdue' | 'Completed' = 'Upcoming';
  notesCount: number = 0;
  allNotes: Note[] = [];
  allTags: Tag[] = [];
  isLoading: boolean = false;
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private sidenavService: SidenavService,
    private notesService: NoteService,
    private tagService: TagService,
    public dialogCreateNote: MatDialog
  ) {
    this.dateValue = new Date()
    const hour = this.dateValue.getHours();
    if(hour >= 5 && hour < 12) this.greeting = 'Good Morning';
    else if(hour >= 12 && hour < 18) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.notesService.getAllNotes().subscribe((notes) => {
      this.allNotes = notes;
    }).add(() => {
      this.tagService.getAllTags().subscribe((tags) => {
        this.allTags = tags;
        this.isLoading = false;
      })
    })
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  openCreateNoteDialog() {
    const dialogRef = this.dialogCreateNote.open(NoteFormComponent, { data: { note: {}, allTags: this.allTags } });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.notesService.saveNote(result).subscribe((data) => {
          this.allNotes = data;
        })
      }
    })
  }

  setNoteCompleted(note: Note) {
    this.notesService.setNoteCompleted(note).subscribe((data) => {
      this.allNotes = data;
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

  isOverdue(note: Note) {
    return note.dueDate && new Date(note.dueDate).getTime() < new Date().getTime();
  }
}
