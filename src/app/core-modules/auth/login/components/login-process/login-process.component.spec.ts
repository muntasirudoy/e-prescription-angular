import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProcessComponent } from './login-process.component';

describe('LoginProcessComponent', () => {
  let component: LoginProcessComponent;
  let fixture: ComponentFixture<LoginProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
