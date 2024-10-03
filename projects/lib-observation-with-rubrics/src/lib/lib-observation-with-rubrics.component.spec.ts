import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibObservationWithRubricsComponent } from './lib-observation-with-rubrics.component';

describe('LibObservationWithRubricsComponent', () => {
  let component: LibObservationWithRubricsComponent;
  let fixture: ComponentFixture<LibObservationWithRubricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibObservationWithRubricsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibObservationWithRubricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
