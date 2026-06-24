import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephoneInputComponent } from './telephone-input.component';

describe('TelephoneInputComponent', () => {
  let component: TelephoneInputComponent;
  let fixture: ComponentFixture<TelephoneInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelephoneInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TelephoneInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
