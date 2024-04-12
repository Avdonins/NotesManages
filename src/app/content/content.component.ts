import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { SidenavService } from '../services/sidenav/sidenav.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { Task } from '../model/task.model';
import { TaskService } from '../services/task/task.service';
import { timeout } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateNoteFormComponent } from '../create-task-form/create-note-form.component';

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
  tasksCount: number = 0;
  allTasks: Task[] = []
  // newTask: Task = {
  //   title: '',
  //   description: '',
  //   completed: false,
  //   tags: [],
  //   dueDate: null
  // }
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(
    private sidenavService: SidenavService,
    private taskService: TaskService,
    public dialogCreateNote: MatDialog
  ) {
    this.dateValue = new Date()
    const hour = this.dateValue.getHours();
    if(hour >= 5 && hour < 12) this.greeting = 'Good Morning';
    else if(hour >= 12 && hour < 18) this.greeting = 'Good Afternoon';
    else this.greeting = 'Good Evening';
  }

  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe((tasks) => {
      console.log(tasks)
    })
  }

  ngAfterViewInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
  }

  openCreateNoteDialog() {
    const dialogRef = this.dialogCreateNote.open(CreateNoteFormComponent, { data: { task: {}, allTags: ['tag1', 'tag2'] } });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(result)
        // this.newTask = result;
        // save new task
      }
    })
  }
}
