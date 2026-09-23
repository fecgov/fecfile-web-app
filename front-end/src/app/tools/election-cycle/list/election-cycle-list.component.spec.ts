import { ElectionCycleService } from '../election-cycle.service';
import { BreakpointStore, ScreenSize } from '../../../store/breakpoint.store';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { ElectionCycle } from '../election-cycle.model';
import { INITIAL_FORM_VALUE } from './election-cycle-form.config';
import { signal, WritableSignal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectionCyclesListComponent } from './election-cycle-list.component';

describe('ElectionCyclesListComponent', () => {
  let component: ElectionCyclesListComponent;
  let fixture: ComponentFixture<ElectionCyclesListComponent>;
  let mockElectionCycleService: Partial<ElectionCycleService>;
  const mockCookieService: Partial<CookieService> = { get: vi.fn().mockReturnValue('mock-cookie') };
  const mockMessageService: Partial<MessageService> = { add: vi.fn() };
  const mockBreakpointStore: Partial<Omit<BreakpointStore, 'screenSize'>> & Pick<BreakpointStore, 'screenSize'> = {
    screenSize: signal<ScreenSize>('lg'),
    getColumnWidths: vi.fn().mockImplementation((config) => config.lg || config.sm),
  };

  const mockDataResponse = {
    count: 1,
    results: [
      new ElectionCycle({
        id: '1',
        office: 'House',
        electionType: 'General',
        electionYear: '2024',
        coverage: {
          startDate: new Date('2023-01-01'),
          endDate: new Date('2024-11-05'),
        },
      }),
    ],
  };

  beforeEach(async () => {
    mockElectionCycleService = {
      getTableData: vi.fn().mockResolvedValue(mockDataResponse),
      create: vi.fn().mockResolvedValue({}),
    };

    await TestBed.configureTestingModule({
      imports: [ElectionCyclesListComponent],
      providers: [
        { provide: MessageService, useValue: mockMessageService },
        { provide: CookieService, useValue: mockCookieService },
      ],
    })
      .overrideComponent(ElectionCyclesListComponent, {
        set: {
          providers: [
            { provide: ElectionCycleService, useValue: mockElectionCycleService },
            { provide: BreakpointStore, useValue: mockBreakpointStore },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ElectionCyclesListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Initial State & Computing Values', () => {
    it('should compute initial pagination parameters correctly', () => {
      expect(component.params()).toEqual({
        page_size: 5,
        page: 1,
        ordering: '-election_year,-start_date',
      });
    });

    it('should dynamically update params when pagination signals change', () => {
      component.rowsPerPage.set(10);
      component.first.set(10);

      expect(component.params()).toEqual({
        page_size: 10,
        page: 2,
        ordering: '-election_year,-start_date',
      });
    });

    it('should compute columns based on BreakpointStore', () => {
      const cols = component.columns();
      expect(cols).toHaveLength(6);
      expect(cols[0].field).toBe('office');
      expect(mockBreakpointStore.getColumnWidths).toHaveBeenCalled();
    });

    it('should shorten header labels on small screen sizes', () => {
      (mockBreakpointStore.screenSize as WritableSignal<ScreenSize>).set('sm');

      const cols = component.columns();
      const typeCol = cols.find((c) => c.field === 'electionType');
      const yearCol = cols.find((c) => c.field === 'electionYear');

      expect(typeCol?.header).toBe('Type');
      expect(yearCol?.header).toBe('Year');
    });
  });

  describe('Adding and Editing Draft Items', () => {
    it('should add a new empty item and set row to editing mode', () => {
      component.addItem();

      expect(component.newItem()).not.toBeNull();
      expect(component.newItem()?.id).toBe('initial');
      expect(component.editingId()).toBe('initial');
      expect(component.isEditing()).toBe(true);
    });

    it('should prepend the new draft item to the items array', () => {
      component.addItem();
      const currentItems = component.items();

      expect(currentItems).toHaveLength(2);
      expect(currentItems[0].id).toBe('initial');
    });

    it('should populate form when row editing is initiated', () => {
      const existingCycle = mockDataResponse.results[0];

      component.onRowEditInit(existingCycle);

      expect(component.editingId()).toBe('1');
      expect(component.form().value()).toEqual({
        office: 'House',
        electionType: 'General',
        electionYear: '2024',
        coverage: existingCycle.coverage,
      });
    });

    it('should clear editing state and reset form on cancelEdit', () => {
      component.addItem();
      expect(component.isEditing()).toBe(true);

      component.cancelEdit();

      expect(component.newItem()).toBeNull();
      expect(component.editingId()).toBeNull();
      expect(component.isEditing()).toBe(false);
      expect(component.model()).toEqual(INITIAL_FORM_VALUE);
    });
  });

  describe('Create Operations', () => {
    beforeEach(() => {
      component.model.set({
        office: 'Senate',
        electionType: 'General',
        electionYear: '2026',
        coverage: {
          startDate: new Date('2025-01-01'),
          endDate: new Date('2026-11-03'),
        },
      });
    });

    it('should call service.create and trigger a success notification on successful save', async () => {
      const reloadSpy = vi.spyOn(component.electionCycleData, 'reload');

      await component.create();

      expect(mockElectionCycleService.create).toHaveBeenCalled();
      expect(component.newItem()).toBeNull();
      expect(reloadSpy).toHaveBeenCalled();
      expect(mockMessageService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'success',
          summary: 'Successful',
        }),
      );
    });

    it('should display error message when service.create fails', async () => {
      vi.spyOn(console, 'log').mockImplementation(() => {});
      vi.mocked(mockElectionCycleService.create!).mockRejectedValueOnce(new Error('Network Error'));

      await component.create();

      expect(mockMessageService.add).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: 'error',
          summary: 'Error',
        }),
      );
    });
  });
});
