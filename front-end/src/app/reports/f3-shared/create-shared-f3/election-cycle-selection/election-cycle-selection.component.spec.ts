import { inputBinding, outputBinding, signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElectionCycle, Coverage } from 'app/tools/election-cycle/election-cycle.model';
import { ElectionCycleService } from 'app/tools/election-cycle/election-cycle.service';
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

  beforeEach(() => {
    electionCycleService = {
      findByCoverage: vi.fn(),
    };
    coverage = signal(createCoverage());

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

  function getElectionCycleText(): string {
    return fixture.nativeElement.querySelector('#election-cycle').textContent.trim();
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

      expect(getElectionCycleText()).toContain('Covering period needed.');
      expect(electionCycleService.findByCoverage).not.toHaveBeenCalled();
    });

    it('should display the covering period needed message when the start date is missing', async () => {
      coverage.set(createCoverage(null, endDate));

      await detectChangesAndWait();

      expect(getElectionCycleText()).toContain('Covering period needed.');
      expect(electionCycleService.findByCoverage).not.toHaveBeenCalled();
    });

    it('should display the covering period needed message when the end date is missing', async () => {
      coverage.set(createCoverage(startDate, null));

      await detectChangesAndWait();

      expect(getElectionCycleText()).toContain('Covering period needed.');
      expect(electionCycleService.findByCoverage).not.toHaveBeenCalled();
    });
  });

  describe('election cycle resource', () => {
    it('should find and display the election cycle for the coverage period', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(cycle);
      const c = createCoverage(startDate, endDate);
      coverage.set(c);

      await detectChangesAndWait();

      expect(electionCycleService.findByCoverage).toHaveBeenCalledWith(c);
      expect(getElectionCycleText()).toContain('House General 2026');
      expect(getElectionCycleText()).toContain('01/01/2026');
      expect(getElectionCycleText()).toContain('03/31/2026');
    });

    it('should emit the matching election cycle', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(cycle);
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(onElectionCycle).toHaveBeenCalledWith(cycle);
    });

    it('should display the no-match message when no election cycle is found', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(null);
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(getElectionCycleText()).toContain('No cycles match report covering period. New cycle needed.');
    });

    it('should emit null when no election cycle matches', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(null);
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(onElectionCycle).toHaveBeenCalledWith(null);
    });

    it('should reload the election cycle when the coverage changes', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(cycle);
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      const updatedCoverage = createCoverage(new Date(2026, 3, 1), new Date(2026, 9, 31));
      coverage.set(updatedCoverage);

      await detectChangesAndWait();

      expect(electionCycleService.findByCoverage).toHaveBeenCalledTimes(2);
      expect(electionCycleService.findByCoverage).toHaveBeenLastCalledWith(updatedCoverage);
    });
  });

  describe('add cycle button', () => {
    it('should be disabled when coverage dates are missing', async () => {
      await detectChangesAndWait();

      expect(getAddButton().disabled).toBe(true);
    });

    it('should be enabled when coverage exists and no cycle matches', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(null);
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(getAddButton().disabled).toBe(false);
    });

    it('should be disabled when an election cycle matches', async () => {
      electionCycleService.findByCoverage.mockResolvedValue(cycle);
      coverage.set(createCoverage(startDate, endDate));

      await detectChangesAndWait();

      expect(getAddButton().disabled).toBe(true);
    });
  });
});
