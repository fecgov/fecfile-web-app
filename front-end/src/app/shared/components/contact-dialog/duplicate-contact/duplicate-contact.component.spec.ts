import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateContactComponent } from './duplicate-contact.component';

describe('DuplicateContactComponent', () => {
  let component: DuplicateContactComponent;
  let fixture: ComponentFixture<DuplicateContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplicateContactComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DuplicateContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
