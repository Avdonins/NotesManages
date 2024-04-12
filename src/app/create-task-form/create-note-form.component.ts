import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import { Task } from '../model/task.model';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { Observable, map, startWith } from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-create-note-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDatepickerModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  providers: [
    provideNativeDateAdapter(),
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}
  ],
  templateUrl: './create-note-form.component.html',
  styleUrl: './create-note-form.component.scss'
})
export class CreateNoteFormComponent implements OnInit {
  task: Task;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = []

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<CreateNoteFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task, allTags: string[] },
  ) {
    this.task = data.task;
    this.allTags = data.allTags || [];
    this.tags = this.task.tags || [];
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice()))
    )
  }

  ngOnInit(): void {
    this.dialogRef.updateSize('30%', 'auto');
  }

  addTag(event: MatChipInputEvent) {
    const value = (event.value || '').trim();
    if(value) {
      this.tags.push(value)
    }
    event.chipInput!.clear();
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(x => x !== tag)
    this.allTags.push(tag)
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.tags.push(event.option.viewValue);
    this.allTags = this.allTags.filter(x => x !== event.option.viewValue);
    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  onCancel() {
    this.dialogRef.close(null)
  }

  onSubmit() {
    this.dialogRef.close(this.task)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }
}
