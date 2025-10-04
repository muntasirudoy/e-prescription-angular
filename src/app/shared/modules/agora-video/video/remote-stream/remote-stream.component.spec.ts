import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoteStreamComponent } from './remote-stream.component';

describe('RemoteStreamComponent', () => {
  let component: RemoteStreamComponent;
  let fixture: ComponentFixture<RemoteStreamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RemoteStreamComponent]
    });
    fixture = TestBed.createComponent(RemoteStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
