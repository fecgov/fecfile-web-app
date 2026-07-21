import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephoneInput } from './telephone.input';

describe('TelephoneInput', () => {
  let component: TelephoneInput;
  let fixture: ComponentFixture<TelephoneInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelephoneInput],
    }).compileComponents();

    fixture = TestBed.createComponent(TelephoneInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
