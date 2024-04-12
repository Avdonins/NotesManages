import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { Task } from '../../model/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor() {}

  // Imitation of fetching server
  getAllTasks(): Observable<Task[]> {
    const fakeRespone: Task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
    return of(fakeRespone).pipe(delay((Math.random() * (4000 + 1000) + 3000)))
  }
}
