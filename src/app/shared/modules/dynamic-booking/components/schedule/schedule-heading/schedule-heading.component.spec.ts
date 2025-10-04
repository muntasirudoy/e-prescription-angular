import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleHeadingComponent } from './schedule-heading.component';

describe('ScheduleHeadingComponent', () => {
  let component: ScheduleHeadingComponent;
  let fixture: ComponentFixture<ScheduleHeadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleHeadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScheduleHeadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
