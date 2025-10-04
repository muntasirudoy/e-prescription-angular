import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalStreamComponent } from './local-stream.component';

describe('LocalStreamComponent', () => {
  let component: LocalStreamComponent;
  let fixture: ComponentFixture<LocalStreamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocalStreamComponent]
    });
    fixture = TestBed.createComponent(LocalStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
