import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionCyclesListComponent } from './election-cycle-list.component';
import { ConfirmationService, MessageService } from 'primeng/api';

describe('ElectionCyclesListComponent', () => {
  let component: ElectionCyclesListComponent;
  let fixture: ComponentFixture<ElectionCyclesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionCyclesListComponent],
      providers: [MessageService, ConfirmationService],
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionCyclesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
