import { inputBinding, outputBinding, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectionCycle, Coverage } from 'app/tools/election-cycle/election-cycle.model';
import {
  ElectionCycleCoverageLookupResponse,
  ElectionCycleService,
} from 'app/tools/election-cycle/election-cycle.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ElectionCycleSelectionComponent } from './election-cycle-selection.component';
import { provideRouter } from '@angular/router';

describe('ElectionCycleSelectionComponent', () => {
  let fixture: ComponentFixture<ElectionCycleSelectionComponent>;
  let electionCycleService: { findByCoverage: ReturnType<typeof vi.fn> };
  let coverage: WritableSignal<Coverage>;
  const onElectionCycle = vi.fn();

  const startDate = new Date(2026, 0, 1);
  const endDate = new Date(2026, 2, 31);
  const nextStartDate = new Date(2026, 3, 1);
  const nextEndDate = new Date(2026, 8, 30);

  const createCoverage = (startDate: Date | null = null, endDate: Date | null = null): Coverage =>
    ({
      startDate,
      endDate,
    }) as Coverage;

  const cycle: ElectionCycle = {
    office: 'House',
    electionType: 'General',
    electionYear: 2026,
    coverage: createCoverage(startDate, endDate),
  } as ElectionCycle;

  const nextCycle: ElectionCycle = {
    office: 'House',
    electionType: 'General',
    electionYear: 2028,
    coverage: createCoverage(nextStartDate, nextEndDate),
  } as ElectionCycle;

  const createLookupResponse = (
    overrides: Partial<ElectionCycleCoverageLookupResponse> = {},
  ): ElectionCycleCoverageLookupResponse => ({
    needsCycle: false,
    needsNextCycle: false,
    electionCycle: cycle,
    nextElectionCycle: null,
    ...overrides,
  });

  beforeEach(() => {
    electionCycleService = {
      findByCoverage: vi.fn(),
    };
    coverage = signal(createCoverage());
    onElectionCycle.mockClear();

    TestBed.configureTestingModule({
      imports: [ElectionCycleSelectionComponent],
      providers: [
        {
          provide: ElectionCycleService,
          useValue: electionCycleService,
        },
        provideRouter([]),
      ],
    });

    fixture = TestBed.createComponent(ElectionCycleSelectionComponent, {
      bindings: [inputBinding('coverage', coverage), outputBinding('electionCycle', onElectionCycle)],
    });
  });

  async function detectChangesAndWait(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function getText(): string {
    return fixture.nativeElement.textContent.trim();
  }

  function getAddButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  }

  it('should create', async () => {
    await detectChangesAndWait();

    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('coverage display', () => {
    it('should display the covering period needed message when dates are missing', async () => {
      await detectChangesAndWait();

      expect(getText()).toContain('Covering period needed.');
      expect(electionCycleService.findByCoverage).not.toHaveBeenCalled();
      expect(onElectionCycle).not.toHaveBeenCalled();
    });

    it('should display the covering period needed message when the start date is missing', async () => {
      coverage.set(createCoverage(null, endDate));

      await detectChangesAndWait();

      expect(getText()).toContain('Covering period needed.');
      expect(electionCycleService.findByCoverage).not.toHaveBeenCalled();
    });

    it('should display the covering period needed message when the end date is missing', async () => {
      coverage.set(createCoverage(startDate, null));

      await detectChangesAndWait();

      expect(getText()).toContain('Covering period needed.');
      expect(electionCycleService.findByCoverage).not.toHaveBeenCalled();
    });

    it('should display the no-match message when a new election cycle is needed', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(
        createLookupResponse({
          needsCycle: true,
          electionCycle: null,
        }),
      );
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(getText()).toContain('No cycles match report covering period. New cycle needed.');
    });

    it('should display the matching election cycle', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(createLookupResponse());
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(getText()).toContain('House General 2026');
      expect(getText()).toContain('01/01/2026');
      expect(getText()).toContain('03/31/2026');
    });

    it('should display the next election cycle when one is returned', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(
        createLookupResponse({
          nextElectionCycle: nextCycle,
        }),
      );
      coverage.set(createCoverage(startDate, nextEndDate));

      await detectChangesAndWait();

      const nextCycleText = fixture.nativeElement.querySelectorAll('.election-cycle')[1].textContent;

      expect(nextCycleText).toContain('House General 2028');
      expect(nextCycleText).toContain('04/01/2026');
      expect(nextCycleText).toContain('09/30/2026');
    });

    it('should show the next-cycle section when a next cycle is required but not found', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(
        createLookupResponse({
          needsNextCycle: true,
        }),
      );
      coverage.set(createCoverage(startDate, nextEndDate));

      await detectChangesAndWait();

      const cycleSections = fixture.nativeElement.querySelectorAll('.election-cycle');

      expect(cycleSections).toHaveLength(2);
      expect(cycleSections[1].textContent).toContain('No cycles match report covering period. New cycle needed.');
    });
  });

  describe('election cycle resource', () => {
    it('should find the election cycle using the current coverage', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(createLookupResponse());
      const currentCoverage = createCoverage(startDate, endDate);
      coverage.set(currentCoverage);

      await detectChangesAndWait();

      expect(electionCycleService.findByCoverage).toHaveBeenCalledWith(currentCoverage);
    });

    it('should emit the complete lookup response', async () => {
      const response = createLookupResponse({
        nextElectionCycle: nextCycle,
      });
      electionCycleService.findByCoverage.mockResolvedValue(response);
      coverage.set(createCoverage(startDate, nextEndDate));

      await detectChangesAndWait();

      expect(onElectionCycle).toHaveBeenCalledExactlyOnceWith(response);
    });

    it('should emit a response indicating that a cycle is needed', async () => {
      const response = createLookupResponse({
        needsCycle: true,
        electionCycle: null,
      });
      electionCycleService.findByCoverage.mockResolvedValue(response);
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(onElectionCycle).toHaveBeenCalledExactlyOnceWith(response);
    });

    it('should emit a response indicating that a next cycle is needed', async () => {
      const response = createLookupResponse({
        needsNextCycle: true,
      });
      electionCycleService.findByCoverage.mockResolvedValue(response);
      coverage.set(createCoverage(startDate, nextEndDate));

      await detectChangesAndWait();

      expect(onElectionCycle).toHaveBeenCalledExactlyOnceWith(response);
    });

    it('should reload the election cycle when the coverage changes', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(createLookupResponse());
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      const updatedCoverage = createCoverage(new Date(2026, 3, 1), new Date(2026, 9, 31));
      coverage.set(updatedCoverage);

      await detectChangesAndWait();

      expect(electionCycleService.findByCoverage).toHaveBeenCalledTimes(2);
      expect(electionCycleService.findByCoverage).toHaveBeenLastCalledWith(updatedCoverage);
    });
  });

  describe('showNextCycle', () => {
    it('should be false when a single cycle covers the period', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(createLookupResponse());
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(fixture.componentInstance.showNextCycle()).toBe(false);
    });

    it('should be true when a next cycle is required', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(
        createLookupResponse({
          needsNextCycle: true,
        }),
      );
      coverage.set(createCoverage(startDate, nextEndDate));

      await detectChangesAndWait();

      expect(fixture.componentInstance.showNextCycle()).toBe(true);
    });

    it('should be true when a next cycle is returned', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(
        createLookupResponse({
          nextElectionCycle: nextCycle,
        }),
      );
      coverage.set(createCoverage(startDate, nextEndDate));

      await detectChangesAndWait();

      expect(fixture.componentInstance.showNextCycle()).toBe(true);
    });
  });

  describe('add cycle button', () => {
    it('should be disabled when coverage dates are missing', async () => {
      await detectChangesAndWait();

      expect(getAddButton().disabled).toBe(true);
    });

    it('should be enabled when no matching cycle is found', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(
        createLookupResponse({
          needsCycle: true,
          electionCycle: null,
        }),
      );
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(getAddButton().disabled).toBe(false);
    });

    it('should be disabled when one cycle covers the period', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(createLookupResponse());
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(getAddButton().disabled).toBe(true);
    });

    it('should be enabled when a next cycle is required but not found', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(
        createLookupResponse({
          needsNextCycle: true,
        }),
      );
      coverage.set(createCoverage(startDate, nextEndDate));

      await detectChangesAndWait();

      expect(getAddButton().disabled).toBe(false);
    });

    it('should be disabled when both cycles cover the period', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(
        createLookupResponse({
          nextElectionCycle: nextCycle,
        }),
      );
      coverage.set(createCoverage(startDate, nextEndDate));

      await detectChangesAndWait();

      expect(getAddButton().disabled).toBe(true);
    });
  });
});
