import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTypeCardComponent } from './booking-type-card.component';

describe('BookingTypeCardComponent', () => {
  let component: BookingTypeCardComponent;
  let fixture: ComponentFixture<BookingTypeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingTypeCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
