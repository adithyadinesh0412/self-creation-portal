import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsLibHolderComponent } from './solutions-lib-holder.component';

describe('SolutionsLibHolderComponent', () => {
  let component: SolutionsLibHolderComponent;
  let fixture: ComponentFixture<SolutionsLibHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionsLibHolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolutionsLibHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
