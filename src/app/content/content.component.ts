import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav/sidenav.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { Note } from '../model/note.model';
import { NoteService } from '../services/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateNoteFormComponent } from '../create-note-form/create-note-form.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [MatSidenavModule, CommonModule, MatIconModule, MatSelectModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit, AfterViewInit{
  dateValue: Date;
  greeting: string = '';
  selectMode: 'week' | 'month' = 'week';
  currentCategory: 'Upcoming' | 'Overdue' | 'Completed' = 'Upcoming';
  notesCount: number = 0;
  allNotes: Note[] = []
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private sidenavService: SidenavService,
    private notesService: NoteService,
    public dialogCreateNote: MatDialog
  ) {
    this.dateValue = new Date()
    const hour = this.dateValue.getHours();
    if(hour >= 5 && hour < 12) this.greeting = 'Good Morning';
    else if(hour >= 12 && hour < 18) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  ngOnInit(): void {
    this.notesService.getAllTasks().subscribe((notes) => {
      this.allNotes = notes;
    })
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  openCreateNoteDialog() {
    const dialogRef = this.dialogCreateNote.open(CreateNoteFormComponent, { data: { note: {}, allTags: ['tag1', 'tag2'] } });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(result)
        // this.newTask = result;
        // save new task
      }
    })
  }
}
