import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { YesNoRadioInputComponent } from './yes-no-radio-input.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

describe('YesNoRadioInputComponent', () => {
  let component: YesNoRadioInputComponent;
  let fixture: ComponentFixture<YesNoRadioInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [YesNoRadioInputComponent],
    });
    fixture = TestBed.createComponent(YesNoRadioInputComponent);
    component = fixture.componentInstance;

    // Set up component with form control
    const form = new FormGroup({ test: new SubscriptionFormControl() }, { updateOn: 'blur' });
    component.form = form;
    component.controlName = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
