import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicBookingComponent } from './dynamic-booking.component';

describe('DynamicBookingComponent', () => {
  let component: DynamicBookingComponent;
  let fixture: ComponentFixture<DynamicBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicBookingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
