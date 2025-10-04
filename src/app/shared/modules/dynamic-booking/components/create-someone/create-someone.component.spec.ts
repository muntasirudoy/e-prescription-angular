import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSomeoneComponent } from './create-someone.component';

describe('CreateSomeoneComponent', () => {
  let component: CreateSomeoneComponent;
  let fixture: ComponentFixture<CreateSomeoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSomeoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateSomeoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
