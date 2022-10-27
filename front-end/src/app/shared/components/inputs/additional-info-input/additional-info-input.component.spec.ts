import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInfoInputComponent } from './additional-info-input.component';

describe('AdditionalInfoInputComponent', () => {
  let component: AdditionalInfoInputComponent;
  let fixture: ComponentFixture<AdditionalInfoInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalInfoInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalInfoInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
