import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicDoctorsComponent } from './public-doctors.component';

describe('PublicDoctorsComponent', () => {
  let component: PublicDoctorsComponent;
  let fixture: ComponentFixture<PublicDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicDoctorsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
