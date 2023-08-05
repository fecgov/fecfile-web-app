import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoRadioInputComponent } from './yes-no-radio-input.component';

describe('YesNoRadioInputComponent', () => {
  let component: YesNoRadioInputComponent;
  let fixture: ComponentFixture<YesNoRadioInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YesNoRadioInputComponent]
    });
    fixture = TestBed.createComponent(YesNoRadioInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
