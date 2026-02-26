import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ControlType,
  NavigationAction,
  NavigationControl,
  NavigationDestination,
} from 'app/shared/models/transaction-navigation-controls.model';
import { JOINT_FUNDRAISING_TRANSFER } from 'app/shared/models/transaction-types/JOINT_FUNDRAISING_TRANSFER.model';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { ButtonModule } from 'primeng/button';
import { NavigationControlComponent } from './navigation-control.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { getTestTransactionByType, testMockStore } from '../../utils/unit-test.utils';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { SelectModule } from 'primeng/select';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { navigationEventSetAction } from 'app/store/navigation-event.actions';
import { cloneInstance, Transaction } from 'app/shared/models';

describe('NavigationControlComponent', () => {
  let component: NavigationControlComponent;
  let fixture: ComponentFixture<NavigationControlComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonModule, SelectModule, ReactiveFormsModule, NavigationControlComponent],
      providers: [FormBuilder, provideMockStore(testMockStore())],
    }).compileComponents();
    store = TestBed.inject(Store);

    fixture = TestBed.createComponent(NavigationControlComponent);
    component = fixture.componentInstance;
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
      fixture = TestBed.createComponent(NavigationControlComponent);
      component = fixture.componentInstance;
      component.transaction = getTestTransactionByType(ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
      component.navigationControl = new NavigationControl(
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
      const storeSpy = spyOn(store, 'dispatch');

      console.log(component.dropdownOptions);
      component.onDropdownChange(component.dropdownOptions[0]); // simulate selecting the first dropdown option

      fixture.detectChanges();
      expect(storeSpy).toHaveBeenCalledWith(
        navigationEventSetAction({
          action: NavigationAction.SAVE,
          destination: NavigationDestination.CHILD,
          transaction: cloneInstance(component.transaction as Transaction),
          destinationTransactionType: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION,
        }),
      );
    });
  });

  it('should have grouped options', () => {
    const options = component.getOptions(TransactionTypeUtils.factory(JOINT_FUNDRAISING_TRANSFER.name));
    expect(options[0].label).toBe('Joint Fundraising Transfer Memo');
    expect(options[0].items[0].label).toBe('Individual');
  });
});
