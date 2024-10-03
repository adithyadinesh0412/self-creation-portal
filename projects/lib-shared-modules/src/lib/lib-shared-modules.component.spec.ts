import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibSharedModulesComponent } from './lib-shared-modules.component';

describe('LibSharedModulesComponent', () => {
  let component: LibSharedModulesComponent;
  let fixture: ComponentFixture<LibSharedModulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibSharedModulesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibSharedModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
