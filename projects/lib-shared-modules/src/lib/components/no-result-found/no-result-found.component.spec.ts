import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultFoundComponent } from './no-result-found.component';

describe('NoResultFoundComponent', () => {
  let component: NoResultFoundComponent;
  let fixture: ComponentFixture<NoResultFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoResultFoundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NoResultFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
