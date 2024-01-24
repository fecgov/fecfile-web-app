import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReattRedesTransactionTypeDetailComponent } from './reatt-redes-transaction-type-detail.component';

describe('ReattRedesTransactionTypeDetailComponent', () => {
  let component: ReattRedesTransactionTypeDetailComponent;
  let fixture: ComponentFixture<ReattRedesTransactionTypeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReattRedesTransactionTypeDetailComponent]
    });
    fixture = TestBed.createComponent(ReattRedesTransactionTypeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
