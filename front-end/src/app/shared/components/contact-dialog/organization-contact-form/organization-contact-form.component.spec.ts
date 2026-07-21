import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationContactFormComponent } from './organization-contact-form.component';

describe('OrganizationContactFormComponent', () => {
  let component: OrganizationContactFormComponent;
  let fixture: ComponentFixture<OrganizationContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationContactFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
