import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportOpposeInputComponent } from './support-oppose-input.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

describe('SupportOpposeInputComponent', () => {
  let component: SupportOpposeInputComponent;
  let fixture: ComponentFixture<SupportOpposeInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SupportOpposeInputComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore(testMockStore())],
    });
    fixture = TestBed.createComponent(SupportOpposeInputComponent);
    component = fixture.componentInstance;
    component.form.setControl('support_oppose_code', new SubscriptionFormControl());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
