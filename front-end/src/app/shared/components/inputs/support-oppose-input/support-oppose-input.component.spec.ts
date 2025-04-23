import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportOpposeInputComponent } from './support-oppose-input.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector } from '@angular/core';

describe('SupportOpposeInputComponent', () => {
  let component: SupportOpposeInputComponent;
  let fixture: ComponentFixture<SupportOpposeInputComponent>;
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SupportOpposeInputComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideMockStore(testMockStore)],
    });
    injector = TestBed.inject(Injector);
    fixture = TestBed.createComponent(SupportOpposeInputComponent);
    component = fixture.componentInstance;
    component.form().setControl('support_oppose_code', new SignalFormControl(injector));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
