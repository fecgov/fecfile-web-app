import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressData, AddressFormComponent, addressSchema, populateAddress } from './address-form.component';
import { apply, form } from '@angular/forms/signals';
import { Component, viewChild, signal } from '@angular/core';

@Component({
  imports: [AddressFormComponent],
  standalone: true,
  template: `<app-address-form [fields]="form.address" />`,
})
class TestHostComponent {
  component = viewChild.required(AddressFormComponent);
  model = signal<{ address: AddressData }>({ address: populateAddress() });
  form = form(this.model, (schemaPath) => apply(schemaPath.address, addressSchema));
}

describe('AddressFormComponent', () => {
  let host: TestHostComponent;
  let component: AddressFormComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressFormComponent],
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
