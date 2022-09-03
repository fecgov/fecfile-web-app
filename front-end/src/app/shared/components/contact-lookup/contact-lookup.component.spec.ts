import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeLookupResponse } from 'app/shared/models/contact.model';
import { UserLoginData } from 'app/shared/models/user.model';
import { ContactService } from 'app/shared/services/contact.service';
import { selectUserLoginData } from 'app/store/login.selectors';
import { DropdownModule } from 'primeng/dropdown';
import { of } from 'rxjs';

import { ContactLookupComponent } from './contact-lookup.component';

describe('ContactLookupComponent', () => {
  let component: ContactLookupComponent;
  let fixture: ComponentFixture<ContactLookupComponent>;

  let testContactService: ContactService;

  beforeEach(async () => {
    const userLoginData: UserLoginData = {
      committee_id: 'C00000000',
      email: 'email@fec.com',
      is_allowed: true,
      token: 'jwttokenstring',
    };

    await TestBed.configureTestingModule({
      declarations: [ContactLookupComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        DropdownModule,
      ],
      providers: [
        FormBuilder,
        ContactService,
        ContactService,
        EventEmitter,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    }).compileComponents();

    testContactService = TestBed.inject(ContactService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactLookupComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onDropdownSearch empty search', fakeAsync(() => {
    const testEvent = { target: { value: null } };
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(component.contactLookupList.length === 0).toBeTrue();
  }));

  it('#onDropdownSearch happy path', fakeAsync(() => {
    spyOn(testContactService, 'committeeLookup').and.returnValue(
      of(new CommitteeLookupResponse()));
    const testEvent = { target: { value: 'hi' } };
    component.onDropdownSearch(testEvent);
    tick(500);
    expect(component.lookupDropdown?.overlayVisible
      === true).toBeTrue();
  }));

  it('#onContactSelect happy path', fakeAsync(() => {
    const eventEmitterEmitSpy = spyOn(
      component.contactSelect, 'emit');
    const testValue = 'testValue';
    const testEvent = {
      originalEvent: {
        type: 'click'
      },
      value: testValue
    };
    component.onContactSelect(testEvent);
    tick(500);
    expect(eventEmitterEmitSpy).toHaveBeenCalledOnceWith(
      testValue);
  }));

});
