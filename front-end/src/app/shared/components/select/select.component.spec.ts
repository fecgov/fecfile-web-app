import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectComponent } from './select.component';
import { Component, viewChild } from '@angular/core';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

@Component({
  imports: [SelectComponent],
  standalone: true,
  template: `<app-select label="test" inputId="test" [options]="options" [control]="control" />`,
})
class TestHostComponent {
  options: PrimeOptions = [{ label: 'test', value: 'test' }];
  control = new SubscriptionFormControl();

  component = viewChild.required(SelectComponent);
}

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
