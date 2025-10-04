import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionPatientComponent } from './prescription-patient.component';

describe('PrescriptionPatientComponent', () => {
  let component: PrescriptionPatientComponent;
  let fixture: ComponentFixture<PrescriptionPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionPatientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrescriptionPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
