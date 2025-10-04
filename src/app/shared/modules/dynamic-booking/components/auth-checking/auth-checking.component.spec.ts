import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCheckingComponent } from './auth-checking.component';

describe('AuthCheckingComponent', () => {
  let component: AuthCheckingComponent;
  let fixture: ComponentFixture<AuthCheckingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCheckingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthCheckingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
