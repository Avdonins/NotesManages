import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav/sidenav.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { Note } from '../model/note.model';
import { MatDialog } from '@angular/material/dialog';
import { NotesComponent } from '../notes/notes.component';
import { Reminder } from '../model/reminder.model';
import { Tag } from '../model/tag.model';
import { RemindersComponent } from '../reminders/reminders.component';
import { ReminderComponent } from '../reminder/reminder.component';
import { TagsWrapperComponent } from '../tags-wrapper/tags-wrapper.component';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [MatSidenavModule, CommonModule, MatIconModule, MatSelectModule, NotesComponent, RemindersComponent, ReminderComponent, TagsWrapperComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit, AfterViewInit {
  dateValue: Date;
  greeting: string = '';
  selectStatisticMode: 'week' | 'month' | 'all' = 'all';
  displayMode: 'notes' | 'reminders' | 'tags' = 'notes';
  elementCount: number = 0;
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
    this.displayMode = (localStorage.getItem('displayMode') as 'notes' | 'reminders' | 'tags') || 'notes';
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  onChangeSelectStatisticMode() {
    switch(this.selectStatisticMode) {
      case 'week':
        this.elementCount = this.allReminders.filter(n => n.completed && n.dueDate && new Date(n.dueDate).getTime() >= new Date().getTime() - 7 * 24 * 60 * 60 * 1000).length;
        break;
      case 'month':
        this.elementCount = this.allReminders.filter(n => n.completed && n.dueDate && new Date(n.dueDate).getTime() >= new Date().getTime() - 30 * 24 * 60 * 60 * 1000).length;
        break;
      case 'all':
        this.elementCount = this.allReminders.filter(n => n.completed).length;
        break;
    }
  }

  changeMode(mode: 'notes' | 'reminders' | 'tags') {
    this.displayMode = mode;
    localStorage.setItem('displayMode', mode);
    if(mode === 'notes') this.selectStatisticMode = 'all';
    this.sidenav.toggle();
  }

  setNotes(notes: Note[]) {
    this.allNotes = notes;
    setTimeout(() => this.onChangeSelectStatisticMode());
  }

  setReminders(reminders: Reminder[]) {
    this.allReminders = reminders;
    setTimeout(() => this.onChangeSelectStatisticMode());
  }

  setTags(tags: Tag[]) {
    this.allTags = tags;
  }
}
