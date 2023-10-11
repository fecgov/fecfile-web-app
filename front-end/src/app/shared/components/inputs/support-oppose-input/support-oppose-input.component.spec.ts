import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportOpposeInputComponent } from './support-oppose-input.component';

describe('SupportOpposeInputComponent', () => {
  let component: SupportOpposeInputComponent;
  let fixture: ComponentFixture<SupportOpposeInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupportOpposeInputComponent]
    });
    fixture = TestBed.createComponent(SupportOpposeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
