import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingForCardComponent } from './booking-for-card.component';

describe('BookingForCardComponent', () => {
  let component: BookingForCardComponent;
  let fixture: ComponentFixture<BookingForCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingForCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingForCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
