import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceSoowgoodComponent } from './police.soowgood.component';

describe('PoliceSoowgoodComponent', () => {
  let component: PoliceSoowgoodComponent;
  let fixture: ComponentFixture<PoliceSoowgoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliceSoowgoodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceSoowgoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
