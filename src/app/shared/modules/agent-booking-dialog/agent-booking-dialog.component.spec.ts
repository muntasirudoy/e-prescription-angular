import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentBookingDialogComponent } from './agent-booking-dialog.component';

describe('AgentBookingDialogComponent', () => {
  let component: AgentBookingDialogComponent;
  let fixture: ComponentFixture<AgentBookingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentBookingDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentBookingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
