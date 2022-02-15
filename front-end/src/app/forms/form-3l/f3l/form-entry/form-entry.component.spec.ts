import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormEntryComponent } from './form-entry.component';
import {HttpClient, HttpHandler} from "@angular/common/http";
import {FormBuilder} from "@angular/forms";
import {CurrencyPipe, DecimalPipe} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {AppConfigService} from "../../../../app-config.service";

describe('FormEntryComponent', () => {
  let component: FormEntryComponent;
  let fixture: ComponentFixture<FormEntryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FormEntryComponent],
        providers: [HttpClient, HttpHandler, FormBuilder, DecimalPipe, CurrencyPipe, AppConfigService],
        imports: [RouterTestingModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FormEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
