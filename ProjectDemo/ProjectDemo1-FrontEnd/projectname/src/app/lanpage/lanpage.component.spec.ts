import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanpageComponent } from './lanpage.component';

describe('LanpageComponent', () => {
  let component: LanpageComponent;
  let fixture: ComponentFixture<LanpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LanpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LanpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
