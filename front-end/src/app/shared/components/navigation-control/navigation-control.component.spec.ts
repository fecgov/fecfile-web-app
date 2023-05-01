import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  NavigationEvent,
} from 'app/shared/models/transaction-navigation-controls.model';
import { JOINT_FUNDRAISING_TRANSFER } from 'app/shared/models/transaction-types/JOINT_FUNDRAISING_TRANSFER.model';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { ButtonModule } from 'primeng/button';
import { NavigationControlComponent } from './navigation-control.component';
import { Dropdown, DropdownModule } from 'primeng/dropdown';
import { FormBuilder } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

describe('NavigationControlComponent', () => {
  let component: NavigationControlComponent;
  let fixture: ComponentFixture<NavigationControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonModule, DropdownModule, ReactiveFormsModule],
      declarations: [NavigationControlComponent, Dropdown],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event', () => {
    // spy on event emitter
    spyOn(component.navigate, 'emit');

    // trigger the click
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('button');
    button.dispatchEvent(new Event('click'));

    fixture.detectChanges();

    expect(component.navigate.emit).toHaveBeenCalledWith(new NavigationEvent());
  });

  describe('with dropdown', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(NavigationControlComponent);
      component = fixture.componentInstance;
      component.navigationControl = new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER_CHILD,
        'Save & add memo',
        '',
        () => false,
        () => true,
        'pi pi-plus'
      );
      fixture.detectChanges();
    });

    it('should be dropdown', () => {
      const nativeElement = fixture.nativeElement;
      const button = nativeElement.querySelector('p-dropdown');
      expect(button).toBeTruthy();
    });
  });

  it('should have grouped options', () => {
    const options = component.getOptions(TransactionTypeUtils.factory(JOINT_FUNDRAISING_TRANSFER.name));
    expect(options[0].label).toBe('Joint Fundraising Transfer Memo');
    expect(options[0].items[0].label).toBe('Individual');
  });
});
