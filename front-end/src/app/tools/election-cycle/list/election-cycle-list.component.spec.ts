import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionCyclesListComponent } from './election-cycle-list.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BreakpointStore } from 'app/store/breakpoint.store';
import { ElectionCycleService } from '../election-cycle.service';

describe('ElectionCyclesListComponent', () => {
  let component: ElectionCyclesListComponent;
  let fixture: ComponentFixture<ElectionCyclesListComponent>;

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionCyclesListComponent],
      providers: [MessageService, ConfirmationService, ElectionCycleService, BreakpointStore],
    }).compileComponents();

    fixture = TestBed.createComponent(ElectionCyclesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
