import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHolderComponent } from './resource-holder.component';

describe('ResourceHolderComponent', () => {
  let component: ResourceHolderComponent;
  let fixture: ComponentFixture<ResourceHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResourceHolderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResourceHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
