import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav/sidenav.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { Note } from '../model/note.model';
import { NoteService } from '../services/note/note.service';
import { MatDialog } from '@angular/material/dialog';
import { NotesComponent } from '../notes/notes.component';
import { Reminder } from '../model/reminder.model';
import { Tag } from '../model/tag.model';
import { ReminderService } from '../services/reminder/reminder.service';
import { RemindersComponent } from '../reminders/reminders.component';
import { ReminderComponent } from '../reminder/reminder.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [MatSidenavModule, CommonModule, MatIconModule, MatSelectModule, NotesComponent, RemindersComponent, ReminderComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit, AfterViewInit {
  dateValue: Date;
  greeting: string = '';
  selectStatisticMode: 'week' | 'month' | 'all' = 'week';
  displayMode: 'notes' | 'reminders' | 'tags' | 'home' = 'reminders';
  notesCount: number = 0;
  allNotes: Note[] = [];
  allReminders: Reminder[] = [];
  allTags: Tag[] = [];

  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private sidenavService: SidenavService,
    public dialogCreateNote: MatDialog
  ) {
    this.dateValue = new Date()
    const hour = this.dateValue.getHours();
    if(hour >= 5 && hour < 12) this.greeting = 'Good Morning';
    else if(hour >= 12 && hour < 18) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  ngOnInit(): void {
    // this.notesService.getAllNotes().subscribe((notes) => {
    //   this.allNotes = notes;
    //   this.notesCount = this.allNotes.filter(n => n.completed).length;
    // }).add(() => {
    //   this.reminderService.getAllReminders().subscribe((reminders) => {
    //     this.allReminders = reminders;
    //   })
    // })
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  onChangeSelectStatisticMode() {
    // switch(this.selectStatisticMode) {
    //   case 'week':
    //     this.notesCount = this.allNotes.filter(n => n.completed && n.dueDate && new Date(n.dueDate).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000).length;
    //     break;
    //   case 'month':
    //     this.notesCount = this.allNotes.filter(n => n.completed && n.dueDate && new Date(n.dueDate).getTime() >= new Date().getTime() - 30 * 24 * 60 * 60 * 1000).length;
    //     break;
    //   case 'all':
    //     this.notesCount = this.allNotes.filter(n => n.completed).length;
    //     break;
    // }
  }

  changeMode(mode: 'notes' | 'reminders' | 'tags' | 'home') {
    this.displayMode = mode;
    this.sidenav.toggle();
  }

  setNotes(notes: Note[]) {
    this.allNotes = notes;
  }

  setReminders(reminders: Reminder[]) {
    this.allReminders = reminders;
  }
}
