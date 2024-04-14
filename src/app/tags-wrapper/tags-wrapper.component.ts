import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Tag } from '../model/tag.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TagService } from '../services/tag/tag.service';
import { NotificationService } from '../services/notification/notification.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tags-wrapper',
  standalone: true,
  imports: [MatAutocompleteModule, MatInputModule, MatChipsModule, MatIconModule, FormsModule, MatButtonModule],
  templateUrl: './tags-wrapper.component.html',
  styleUrl: './tags-wrapper.component.scss'
})
export class TagsWrapperComponent implements OnInit {

  constructor(
    private tagService: TagService,
    private notificationService: NotificationService
  ) {}

  allTags: Tag[] = [];
  tagColor: string = '#e0e0e0';
  newTag: string = '';
  colors: string[] = ['#F08080', '#20B2AA', '#FAFAD2', '#3CB371', '#EE82EE', 'orange', 'brown', '#e0e0e0'];
  @Output() setTags: EventEmitter<Tag[]> = new EventEmitter<Tag[]>();

  ngOnInit(): void {
    this.tagService.getAllTags().subscribe(tags => {
      this.allTags = tags;
      this.setTags.emit(this.allTags);
    })
  }

  removeTag(tag: Tag) {
    this.tagService.deleteTag(tag.id)
    this.allTags = this.allTags.filter(x => x !== tag)
  }

  addTag() {
    if ((this.newTag || '').trim()) {
      this.tagService.saveTag(this.newTag.trim(), this.tagColor).subscribe(
        (data) => {
          if(!this.allTags.find(x => x.id === data.id)) {
            this.allTags.push(data)
          }
          this.newTag = ''
        },
        (error) => this.notificationService.showSnackbar(error)
      )
    } else {
      this.notificationService.showSnackbar('Tag name cannot be empty!');
      return
    }
  }    
}
