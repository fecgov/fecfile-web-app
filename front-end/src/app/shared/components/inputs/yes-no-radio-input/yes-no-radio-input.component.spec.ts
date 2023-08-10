import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from 'app/shared/shared.module';
import { YesNoRadioInputComponent } from './yes-no-radio-input.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
