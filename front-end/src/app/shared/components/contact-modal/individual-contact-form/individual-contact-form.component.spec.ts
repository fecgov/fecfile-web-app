import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualContactFormComponent } from './individual-contact-form.component';

describe('IndividualContactFormComponent', () => {
  let component: IndividualContactFormComponent;
  let fixture: ComponentFixture<IndividualContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualContactFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
