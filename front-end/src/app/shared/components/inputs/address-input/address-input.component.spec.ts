import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { testTemplateMap } from 'app/shared/utils/unit-test.utils';
import { AddressInputComponent } from './address-input.component';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddressInputComponent, ErrorMessagesComponent],
      imports: [DropdownModule, InputTextModule, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      contributor_street_1: new FormControl(''),
      contributor_street_2: new FormControl(''),
      contributor_city: new FormControl(''),
      contributor_state: new FormControl(''),
      contributor_zip: new FormControl(''),
    });
    component.templateMap = testTemplateMap;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
