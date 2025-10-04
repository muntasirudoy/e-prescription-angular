import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookForComponent } from './book-for.component';

describe('BookForComponent', () => {
  let component: BookForComponent;
  let fixture: ComponentFixture<BookForComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookForComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookForComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
