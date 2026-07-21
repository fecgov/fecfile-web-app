import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTransactionTableComponent } from './contact-transaction-table.component';

describe('ContactTransactionTableComponent', () => {
  let component: ContactTransactionTableComponent;
  let fixture: ComponentFixture<ContactTransactionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactTransactionTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactTransactionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
