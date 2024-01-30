import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionAccordionTabComponent } from './transaction-accordion-tab.component';

describe('TransactionAccordionTabComponent', () => {
  let component: TransactionAccordionTabComponent;
  let fixture: ComponentFixture<TransactionAccordionTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionAccordionTabComponent]
    });
    fixture = TestBed.createComponent(TransactionAccordionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
