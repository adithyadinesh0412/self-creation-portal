import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResoureListsComponent } from './resoure-lists.component';

describe('ResoureListsComponent', () => {
  let component: ResoureListsComponent;
  let fixture: ComponentFixture<ResoureListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResoureListsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResoureListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
