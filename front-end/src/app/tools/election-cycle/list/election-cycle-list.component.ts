import { Component, computed, inject, linkedSignal, resource, Signal, signal, viewChild } from '@angular/core';
import { ElectionCycle } from '../election-cycle.model';
import { ElectionCycleService } from '../election-cycle.service';
import { ButtonModule } from 'primeng/button';
import { BreakpointStore } from '../../../store/breakpoint.store';
import { form, FormField, required, FormRoot } from '@angular/forms/signals';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { SelectInput } from 'app/shared/components/signal-inputs/select-input/select.input';
import { NumberInput, validateYear } from 'app/shared/components/signal-inputs/number-input/number.input';
import { DateInput } from 'app/shared/components/signal-inputs/date-input/date.input';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'environments/environment';
import { Table, TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { SharedTableTemplates } from 'app/shared/components/table/shared-table.templates';
import { NgTemplateOutlet } from '@angular/common';
import { ColumnDefinition } from 'app/shared/components/table/table.component';
import {
  COLUMN_WIDTH_CONFIG,
  ElectionCycleForm,
  electionTypeOptions,
  INITIAL_FORM_VALUE,
  officeOptions,
} from './election-cycle-form.config';
import {
  validateDate,
  validateDateAfter,
  validateDateOverlap,
} from 'app/shared/components/signal-inputs/date-input/date.validators';

@Component({
  selector: 'app-election-cycle-list',
  imports: [
    ButtonModule,
    RippleModule,
    FormField,
    SelectInput,
    NumberInput,
    DateInput,
    FormRoot,
    FecDatePipe,
    TableModule,
    PrimeTemplate,
    SharedTableTemplates,
    NgTemplateOutlet,
  ],
  providers: [ElectionCycleService, BreakpointStore],
  templateUrl: './election-cycle-list.component.html',
  styleUrl: './election-cycle-list.component.scss',
})
export class ElectionCyclesListComponent {
  readonly messageService = inject(MessageService);
  private readonly cookieService = inject(CookieService);
  protected itemService = inject(ElectionCycleService);
  readonly breakpointStore = inject(BreakpointStore);

  /* FORM PROPERTIES */
  readonly model = signal<ElectionCycleForm>(INITIAL_FORM_VALUE);
  readonly form = form(
    this.model,
    (schema) => {
      required(schema.office, { message: requiredMessage });
      required(schema.electionType, { message: requiredMessage });
      required(schema.electionYear, { message: requiredMessage });
      required(schema.coverage.startDate, { message: requiredMessage });
      required(schema.coverage.endDate, { message: requiredMessage });

      validateYear(schema.electionYear);

      validateDate(schema.coverage.startDate);
      validateDate(schema.coverage.endDate);
      validateDateAfter(schema.coverage);
      validateDateOverlap(schema.coverage, `${environment.apiUrl}/election-cycles/check-overlap/`, this.cookieService, {
        message: 'This date overlaps with another election cycle.',
      });
    },
    {
      submission: {
        ignoreValidators: 'none',
        action: async () => {
          if (this.newItem()) this.create();
          else this.update();
          this.clearEditing();
          this.form().reset(INITIAL_FORM_VALUE);
        },
      },
    },
  );
  protected disableSubmission = computed(() => this.form().invalid() || this.form().submitting());
  readonly officeOptions = officeOptions;
  readonly electionTypeOptions = electionTypeOptions;

  /* TABLE PROPERTIES */
  readonly rowsPerPage = signal(5);
  readonly first = linkedSignal({
    source: this.rowsPerPage,
    computation: () => 0,
  });
  readonly table = viewChild.required(Table);
  readonly editingId = signal<string | null>(null);
  readonly isEditing = computed(() => this.editingId() !== null);

  readonly params = computed(() => {
    const rows = this.rowsPerPage();
    return { page_size: rows, page: Math.floor(this.first() / rows) + 1, ordering: '-election_year,-start_date' };
  });

  readonly electionCycleData = resource({
    params: () => this.params(),
    loader: ({ params }) => this.itemService.getTableData(params),
  });
  readonly totalItems = computed(() => this.electionCycleData.value()?.count ?? 0);
  readonly newItem = signal<ElectionCycle | null>(null);
  readonly items = computed(() => {
    const fetched = (this.electionCycleData.value()?.results as ElectionCycle[]) ?? [];
    const draft = this.newItem();
    return draft ? [draft, ...fetched] : fetched;
  });

  readonly columns: Signal<ColumnDefinition<ElectionCycle>[]> = computed(() => {
    const widths = this.breakpointStore.getColumnWidths(COLUMN_WIDTH_CONFIG);
    const isSmall = this.breakpointStore.screenSize() === 'sm';
    return [
      { field: 'office', header: 'Office', width: widths.office },
      { field: 'electionType', header: isSmall ? 'Type' : 'Election Type', width: widths.electionType },
      { field: 'electionYear', header: isSmall ? 'Year' : 'Election Year', width: widths.electionYear },
      { field: 'startDate', header: 'Start Date', width: widths.startDate },
      { field: 'endDate', header: 'End Date', width: widths.endDate },
      { field: '', header: '', width: widths.actions },
    ];
  });

  addItem() {
    const newItem = ElectionCycle.createEmpty();
    this.newItem.set(newItem);
    this.setEditing(newItem.id);
  }

  cancelEdit() {
    this.newItem.set(null);
    this.form().reset(INITIAL_FORM_VALUE);
    this.clearEditing();
  }

  onRowEditInit(cycle: ElectionCycle) {
    this.editingId.set(cycle.id);
    this.form().reset({
      office: cycle.office,
      electionType: cycle.electionType,
      electionYear: cycle.electionYear,
      coverage: cycle.coverage,
    });
  }

  async create() {
    try {
      this.newItem.set(null);
      const cycle = new ElectionCycle(this.form().value());
      await this.itemService.create(cycle);
      this.electionCycleData.reload();
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: `New Election cycle created`,
        life: 3000,
      });
    } catch (error) {
      console.log('error saving', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'There was an error creating your new election cycle',
        life: 3000,
      });
    }
  }

  async update() {
    // TODO
  }

  private setEditing(id: string) {
    this.table().editingRowKeys[id] = true;
    this.editingId.set(id);
  }

  private clearEditing() {
    const id = this.editingId();
    if (!id) return;
    this.table().editingRowKeys[id] = false;
    this.editingId.set(null);
  }
}
