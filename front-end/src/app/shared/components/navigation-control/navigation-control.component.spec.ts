import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ControlType,
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  NavigationEvent,
  SAVE_LIST_CONTROL,
} from 'app/shared/models/transaction-navigation-controls.model';
import { ButtonModule } from 'primeng/button';
import { NavigationControlComponent } from './navigation-control.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { getTestTransactionByType, testMockStore, testScheduleATransaction } from '../../utils/unit-test.utils';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { SelectModule } from 'primeng/select';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { navigationEventSetAction } from 'app/store/navigation-event.actions';
import { cloneInstance, Transaction, TransactionTypes } from 'app/shared/models/transaction.model';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [NavigationControlComponent],
  standalone: true,
  template: `<app-navigation-control [transaction]="transaction" [navigationControl]="navigationControl" />`,
})
class TestHostComponent {
  component = viewChild.required(NavigationControlComponent);
  transaction?: Transaction;
  navigationControl = SAVE_LIST_CONTROL;
  constructor() {
    this.transaction = testScheduleATransaction();
  }
}

describe('NavigationControlComponent', () => {
  let host: TestHostComponent;
  let component: NavigationControlComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonModule, SelectModule, ReactiveFormsModule, NavigationControlComponent],
      providers: [FormBuilder, provideMockStore(testMockStore())],
    }).compileComponents();
    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
  });

  describe('button', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should dispatch a navigationEvent', () => {
      // spy on event emitter
      const storeSpy = vi.spyOn(store, 'dispatch');

      // trigger the click
      const nativeElement = fixture.nativeElement;
      const button = nativeElement.querySelector('button');
      button.dispatchEvent(new Event('click'));

      fixture.detectChanges();

      expect(storeSpy).toHaveBeenCalled();
    });

    it('should allow adding another', () => {
      // spy on event emitter
      const storeSpy = vi.spyOn(store, 'dispatch');

      component.saveAndAddAnother();

      fixture.detectChanges();
      const navigationEvent = new NavigationEvent(
        component.navigationControl().navigationAction,
        NavigationDestination.ANOTHER,
        cloneInstance(component.transaction() as Transaction),
        component.transaction()?.transaction_type_identifier as TransactionTypes,
      );
      expect(storeSpy).toHaveBeenCalledWith(navigationEventSetAction(navigationEvent));
    });

    it('should have grouped options', () => {
      const transaction = getTestTransactionByType(ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER);
      const options = component.getOptions(transaction);
      expect(options[0].label).toBe('Joint Fundraising Transfer Memo');
      expect(options[0].items[0].label).toBe('Individual');
    });
  });

  describe('with dropdown', () => {
    beforeEach(async () => {
      host.transaction = getTestTransactionByType(ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
      host.navigationControl = new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER,
        'Save & add memo',
        '',
        () => false,
        () => true,
        'pi pi-plus',
        ControlType.DROPDOWN,
      );
      fixture.detectChanges();
    });

    it('should be dropdown', () => {
      const nativeElement = fixture.nativeElement;
      const button = nativeElement.querySelector('.dd-button');
      expect(button).toBeTruthy();
    });

    it('should dispatch a navigationEvent with a transaction', () => {
      // spy on event emitter
      const storeSpy = vi.spyOn(store, 'dispatch');

      console.log(component.dropdownOptions);
      component.onDropdownChange(component.dropdownOptions()[0]); // simulate selecting the first dropdown option

      fixture.detectChanges();
      expect(storeSpy).toHaveBeenCalledWith(
        navigationEventSetAction({
          action: NavigationAction.SAVE,
          destination: NavigationDestination.CHILD,
          transaction: cloneInstance(component.transaction() as Transaction),
          destinationTransactionType: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION,
        }),
      );
    });
  });
});
