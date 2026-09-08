import { Component, computed, inject, Signal, TemplateRef, viewChild } from '@angular/core';
import { ColumnDefinition, TableBodyContext, TableComponent } from 'app/shared/components/table/table.component';
import { ElectionCycle } from '../election-cycle.model';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { ElectionCycleService } from '../election-cycle.service';
import { ButtonModule } from 'primeng/button';
import { BreakpointStore } from '../../../store/breakpoint.store';

const COLUMN_WIDTH_CONFIG = {
  sm: { office: '18.2%', type: '18.2%', year: '12.3%', startDate: '12.3%', endDate: '12.3%', actions: '7.5%' },
  md: { office: '17.6%', type: '17.6%', year: '17.6%', startDate: '20.3%', endDate: '20.3%', actions: '6.6%' },
  lg: { office: '18.9%', type: '18.9%', year: '18.9%', startDate: '18.9%', endDate: '18.9%', actions: '5.5%' },
};

@Component({
  selector: 'app-election-cycle-list',
  imports: [TableComponent, ButtonModule],
  providers: [ElectionCycleService, BreakpointStore],
  templateUrl: './election-cycle-list.component.html',
  styleUrl: './election-cycle-list.component.scss',
})
export class ElectionCyclesListComponent extends TableListBaseComponent<ElectionCycle> {
  protected override itemService = inject(ElectionCycleService);
  private readonly breakpointStore = inject(BreakpointStore);

  protected override getEmptyItem(): ElectionCycle {
    return {
      id: '',
      office: '',
      electionType: '',
      electionYear: '',
      startDate: null,
      endDate: null,
    };
  }

  readonly actionsBodyTpl = viewChild.required<TemplateRef<TableBodyContext<ElectionCycle>>>('actionsBody');

  readonly columns: Signal<ColumnDefinition<ElectionCycle>[]> = computed(() => {
    const size = this.breakpointStore.screenSize();
    const widths = COLUMN_WIDTH_CONFIG[size];
    const isSmall = size === 'sm';

    return [
      { field: 'office', header: 'Office', width: widths.office },
      { field: 'electionType', header: isSmall ? 'Type' : 'Election Type', width: widths.type },
      { field: 'electionYear', header: isSmall ? 'Year' : 'Election Year', width: widths.year },
      { field: 'startDate', header: 'Start Date', width: widths.startDate },
      { field: 'endDate', header: 'End Date', width: widths.endDate },
      { field: '', header: '', bodyTpl: this.actionsBodyTpl(), width: widths.actions },
    ];
  });
}
