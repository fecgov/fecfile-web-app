import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ControlType,
  NavigationAction,
  NavigationControl,
  NavigationDestination,
} from 'app/shared/models/transaction-navigation-controls.model';
import { ButtonModule } from 'primeng/button';
import { NavigationControlComponent } from './navigation-control.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { getTestTransactionByType, testMockStore } from '../../utils/unit-test.utils';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { SelectModule } from 'primeng/select';
import { navigationEventSetAction } from 'app/store/navigation-event.actions';
import { Transaction } from 'app/shared/models/transaction.model';
import { ScheduleATransactionTypes } from 'app/shared/models/type-enums';
import { TransactionUtils } from 'app/shared/utils/transaction.utils';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [NavigationControlComponent],
  standalone: true,
  template: `<app-navigation-control [transaction]="transaction" [navigationControl]="navigationControl" />`,
})
class TestHostComponent {
  component = viewChild.required(NavigationControlComponent);
  transaction?: Transaction;
  navigationControl?: NavigationControl;
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch a navigationEvent', () => {
    // spy on event emitter
    const storeSpy = spyOn(store, 'dispatch');

    // trigger the click
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('button');
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(storeSpy).toHaveBeenCalled();
  });

  describe('with dropdown', () => {
    beforeEach(async () => {
      const transaction = await getTestTransactionByType(ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
      const navigationControl = new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER,
        'Save & add memo',
        '',
        () => false,
        () => true,
        'pi pi-plus',
        ControlType.DROPDOWN,
      );

      const options = await component.getOptions(transaction);
      spyOn(component, 'getOptions').and.resolveTo(options);
      host.transaction = transaction;
      host.navigationControl = navigationControl;
      fixture.detectChanges();
    });

    it('should be dropdown', () => {
      const nativeElement = fixture.nativeElement;
      const button = nativeElement.querySelector('.dd-button');
      expect(button).toBeTruthy();
    });

    it('should dispatch a navigationEvent with a transaction', () => {
      // spy on event emitter
      const storeSpy = spyOn(store, 'dispatch');
      component.onDropdownChange(component.dropdownOptions()[0]); // simulate selecting the first dropdown option

      fixture.detectChanges();
      expect(storeSpy).toHaveBeenCalledWith(
        navigationEventSetAction({
          action: NavigationAction.SAVE,
          destination: NavigationDestination.CHILD,
          transaction: TransactionUtils.cloneInstance(component.transaction() as Transaction),
          destinationTransactionType: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION,
        }),
      );
    });
  });

  it('should have grouped options', async () => {
    const transaction = await TransactionUtils.createNewTransactionByIdentifier(
      ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
    );
    const options = await component.getOptions(transaction);
    expect(options[0].label).toBe('Joint Fundraising Transfer Memo');
    expect(options[0].items[0].label).toBe('Individual');
  });
});
