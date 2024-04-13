import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Reminder } from '../model/reminder.model';
import { Tag } from '../model/tag.model';
import { MatDialog } from '@angular/material/dialog';
import { PopupFormComponent } from '../popup-form/popup-form.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-reminder',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  templateUrl: './reminder.component.html',
  styleUrl: './reminder.component.scss'
})
export class ReminderComponent {

  constructor(public dialogCreateReminder: MatDialog) {}

  @Input() reminder: Reminder;
  @Input() allTags: Tag[]
  @Output() setReminderCompleted: EventEmitter<Reminder> = new EventEmitter<Reminder>();
  @Output() editReminder: EventEmitter<Reminder> = new EventEmitter<Reminder>();
  @Output() deleteReminder: EventEmitter<number> = new EventEmitter<number>();
  @Output() setReminderRendered: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('reminderElement') reminderElement: ElementRef;

  ngOnInit(): void {
    this.setReminderRendered.emit();
  }

  onSetReminderCompleted() {
    this.reminderElement.nativeElement.classList.add('completed');
    this.setReminderCompleted?.emit(this.reminder);
  }

  onEditReminder(reminder: Reminder) {
    const dialogRef = this.dialogCreateReminder.open(PopupFormComponent, { data: { reminder: {...reminder}, allTags: this.allTags, mode: 'reminder' } });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.editReminder.emit(result);
      }
    })
  }

  onDeleteReminder(id: number) {
    this.deleteReminder.emit(id);
  }

  isDeadlineClose(reminder: Reminder) {
    return reminder.dueDate && !reminder.completed && new Date().setDate(new Date().getDate() + 3) >= new Date(reminder.dueDate).getTime()
  }
}
