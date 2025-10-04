import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationIdComponent } from './organization-id.component';

describe('OrganizationIdComponent', () => {
  let component: OrganizationIdComponent;
  let fixture: ComponentFixture<OrganizationIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationIdComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizationIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
