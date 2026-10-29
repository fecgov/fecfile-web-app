import { Component, computed, inject, input, output, resource } from '@angular/core';
import { Coverage } from 'app/tools/election-cycle/election-cycle.model';
import {
  ElectionCycleCoverageLookupResponse,
  ElectionCycleService,
} from 'app/tools/election-cycle/election-cycle.service';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';

const defaultValue = {
  electionCycle: null,
  nextElectionCycle: null,
  needsCycle: true,
  needsNextCycle: false,
} as const;

@Component({
  selector: 'app-election-cycle-selection',
  imports: [ButtonModule, RouterLink, FecDatePipe],
  templateUrl: './election-cycle-selection.component.html',
  styleUrl: './election-cycle-selection.component.scss',
})
export class ElectionCycleSelectionComponent {
  private readonly electionCycleService = inject(ElectionCycleService);

  readonly coverage = input.required<Coverage>();
  readonly electionCycle = output<ElectionCycleCoverageLookupResponse>();
  readonly electionCyclesResource = resource({
    params: () => this.coverage(),
    loader: async ({ params }) => {
      if (params.startDate === null || params.endDate === null) return defaultValue;
      const response = await this.electionCycleService.findByCoverage(params);
      this.electionCycle.emit(response);
      return response;
    },
    defaultValue,
  });
  readonly showNextCycle = computed(() => {
    const { needsNextCycle, nextElectionCycle } = this.electionCyclesResource.value();
    return needsNextCycle || !!nextElectionCycle;
  });

  readonly hasCoverage = computed(() => {
    const { startDate, endDate } = this.coverage();
    return startDate !== null && endDate !== null;
  });

  readonly noElectionCycleMatch = 'No cycles match report covering period. New cycle needed.' as const;
  readonly coverageNeeded = 'Covering period needed.' as const;

  readonly disableAdd = computed(
    () =>
      !this.hasCoverage() ||
      this.electionCyclesResource.isLoading() ||
      (!this.electionCyclesResource.value().needsCycle && !this.electionCyclesResource.value().needsNextCycle),
  );
}
