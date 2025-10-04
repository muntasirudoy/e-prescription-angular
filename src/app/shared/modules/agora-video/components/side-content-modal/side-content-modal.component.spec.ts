import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideContentModalComponent } from './side-content-modal.component';

describe('SideContentModalComponent', () => {
  let component: SideContentModalComponent;
  let fixture: ComponentFixture<SideContentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideContentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SideContentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
