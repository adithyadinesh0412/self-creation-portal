import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewModelComponent } from './review-model.component';

describe('ReviewModelComponent', () => {
  let component: ReviewModelComponent;
  let fixture: ComponentFixture<ReviewModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewModelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
