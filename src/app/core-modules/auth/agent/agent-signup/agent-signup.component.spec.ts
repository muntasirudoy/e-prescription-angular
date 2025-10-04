import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentSignupComponent } from './agent-signup.component';

describe('AgentSignupComponent', () => {
  let component: AgentSignupComponent;
  let fixture: ComponentFixture<AgentSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgentSignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
