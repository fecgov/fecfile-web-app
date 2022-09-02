import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidateService } from 'app/shared/services/validate.service';

import { ContactLookupComponent } from './contact-lookup.component';

describe('ContactLookupComponent', () => {
  let component: ContactLookupComponent;
  let fixture: ComponentFixture<ContactLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactLookupComponent],
      providers: [ValidateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactLookupComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
