import { Component, EventEmitter, Output } from '@angular/core';
import { Reminder } from '../model/reminder.model';
import { ReminderComponent } from '../reminder/reminder.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Tag } from '../model/tag.model';
import { MatDialog } from '@angular/material/dialog';
import { TagService } from '../services/tag/tag.service';
import { ReminderService } from '../services/reminder/reminder.service';
import { PopupFormComponent } from '../popup-form/popup-form.component';

@Component({
  selector: 'app-reminders',
  standalone: true,
  imports: [ReminderComponent, CommonModule, MatIconModule],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.scss'
})
export class RemindersComponent {
  currentCategory: 'Upcoming' | 'Overdue' | 'Completed' = 'Upcoming';
  allReminders: Reminder[] = [];
  allTags: Tag[] = [];
  isLoading: boolean = false;
  isEmpty: boolean = true;

  constructor(
    private remindersService: ReminderService,
    private tagService: TagService,
    public dialogCreateReminder: MatDialog
  ) {
  }

  @Output() setReminders: EventEmitter<Reminder[]> = new EventEmitter<Reminder[]>();

  ngOnInit(): void {
    this.isLoading = true;
    this.remindersService.getAllReminders().subscribe((reminders) => {
      this.allReminders = reminders;
      console.log(reminders);
      this.setReminders.emit(this.allReminders);
    }).add(() => {
      this.tagService.getAllTags().subscribe((tags) => {
        this.allTags = tags;
        this.isLoading = false;
      })
    })
  }
  
  openCreateReminderDialog() {
    const dialogRef = this.dialogCreateReminder.open(PopupFormComponent, { data: { reminder: {}, allTags: this.allTags, mode: 'reminder' } });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.remindersService.saveReminder(result).subscribe((data) => {
          this.allReminders = data;
        })
      }
    })
  }

  setReminderCompleted(reminder: Reminder) {
    this.remindersService.setReminderCompleted(reminder).subscribe((data) => {
      this.allReminders = data;
    })
  }

  editReminder(reminder: Reminder) {
    this.remindersService.editReminder(reminder).subscribe((response: boolean) => {
      if(!response) alert('Error!');
    })
  }

  deleteReminder(id: number) {
    this.remindersService.deleteReminder(id).subscribe((response: boolean) => {
      if(!response) {
        alert('Error!');
        return;
      } else {
        this.allReminders = this.allReminders.filter(reminder => reminder.id !== id)
      }
    })
  }

  onCurrentCategoryChange(category: 'Upcoming' | 'Overdue' | 'Completed') {
    if(this.currentCategory === category) return;
    this.isEmpty = true;
    this.currentCategory = category;
  }

  isOverdue(reminder: Reminder) {
    return reminder.dueDate && new Date(reminder.dueDate).getTime() < new Date().getTime();
  }

  setReminderRendered() {
    console.log(
      'upd'
    )
    if(this.isEmpty) {
      setTimeout(() => this.isEmpty = false);
    }
  }
}
