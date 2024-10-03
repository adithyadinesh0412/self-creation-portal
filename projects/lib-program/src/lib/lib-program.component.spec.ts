import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibProgramComponent } from './lib-program.component';

describe('LibProgramComponent', () => {
  let component: LibProgramComponent;
  let fixture: ComponentFixture<LibProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibProgramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
