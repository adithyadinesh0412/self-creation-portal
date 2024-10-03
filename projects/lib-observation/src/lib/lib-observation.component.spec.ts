import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibObservationComponent } from './lib-observation.component';

describe('LibObservationComponent', () => {
  let component: LibObservationComponent;
  let fixture: ComponentFixture<LibObservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibObservationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibObservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
