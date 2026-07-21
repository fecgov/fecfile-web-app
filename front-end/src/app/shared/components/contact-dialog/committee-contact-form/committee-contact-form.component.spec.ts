import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeContactFormComponent } from './committee-contact-form.component';

describe('CommitteeContactFormComponent', () => {
  let component: CommitteeContactFormComponent;
  let fixture: ComponentFixture<CommitteeContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitteeContactFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommitteeContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
