import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubTasksResourcesComponent } from './sub-tasks-resources.component';

describe('SubTasksResourcesComponent', () => {
  let component: SubTasksResourcesComponent;
  let fixture: ComponentFixture<SubTasksResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubTasksResourcesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubTasksResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
