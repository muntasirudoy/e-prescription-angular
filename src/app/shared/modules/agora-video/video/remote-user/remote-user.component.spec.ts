import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteUserComponent } from './remote-user.component';

describe('RemoteUserComponent', () => {
  let component: RemoteUserComponent;
  let fixture: ComponentFixture<RemoteUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoteUserComponent]
    });
    fixture = TestBed.createComponent(RemoteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
