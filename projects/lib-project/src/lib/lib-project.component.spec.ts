import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibProjectComponent } from './lib-project.component';

describe('LibProjectComponent', () => {
  let component: LibProjectComponent;
  let fixture: ComponentFixture<LibProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibProjectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
