import { Component, computed, inject, input, output, resource } from '@angular/core';
import { Coverage, ElectionCycle } from 'app/tools/election-cycle/election-cycle.model';
import { ElectionCycleService } from 'app/tools/election-cycle/election-cycle.service';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';

@Component({
  selector: 'app-election-cycle-selection',
  imports: [ButtonModule, RouterLink, FecDatePipe],
  templateUrl: './election-cycle-selection.component.html',
  styleUrl: './election-cycle-selection.component.scss',
})
export class ElectionCycleSelectionComponent {
  private readonly electionCycleService = inject(ElectionCycleService);

  readonly coverage = input.required<Coverage>();
  readonly electionCycle = output<ElectionCycle | null>();
  readonly electionCycleResource = resource({
    params: () => this.coverage(),
    loader: async ({ params }) => {
      if (params.startDate === null || params.endDate === null) return null;
      const cycle = await this.electionCycleService.findByCoverage(params);
      this.electionCycle.emit(cycle);
      return cycle;
    },
    defaultValue: null,
  });

  readonly hasCoverage = computed(() => {
    const { startDate, endDate } = this.coverage();
    return startDate !== null && endDate !== null;
  });

  readonly noElectionCycleMatch = 'No cycles match report covering period. New cycle needed.' as const;
  readonly coverageNeeded = 'Covering period needed.' as const;

  readonly disableAdd = computed(
    () => !this.hasCoverage() || this.electionCycleResource.isLoading() || this.electionCycleResource.value() !== null,
  );
}
