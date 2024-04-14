import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsWrapperComponent } from './tags-wrapper.component';

describe('TagsWrapperComponent', () => {
  let component: TagsWrapperComponent;
  let fixture: ComponentFixture<TagsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagsWrapperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
