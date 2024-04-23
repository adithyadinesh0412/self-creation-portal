import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibSurveyComponent } from './lib-survey.component';

describe('LibSurveyComponent', () => {
  let component: LibSurveyComponent;
  let fixture: ComponentFixture<LibSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibSurveyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
