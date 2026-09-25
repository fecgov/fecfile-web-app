import { Component, computed, inject, linkedSignal, resource, Signal, signal, viewChild } from '@angular/core';
import { ElectionCycle } from '../election-cycle.model';
import { ElectionCycleService } from '../election-cycle.service';
import { ButtonModule } from 'primeng/button';
import { BreakpointStore } from '../../../store/breakpoint.store';
import { FormField, FormRoot } from '@angular/forms/signals';
import { SelectInput } from 'app/shared/components/signal-inputs/select-input/select.input';
import { NumberInput } from 'app/shared/components/signal-inputs/number-input/number.input';
import { DateInput } from 'app/shared/components/signal-inputs/date-input/date.input';
import { FecDatePipe } from '../../../shared/pipes/fec-date.pipe';
import { CookieService } from 'ngx-cookie-service';
import { Table, TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { PrimeTemplate } from 'primeng/api';
import { SharedTableTemplates } from 'app/shared/components/table/shared-table.templates';
import { NgTemplateOutlet } from '@angular/common';
import { ColumnDefinition } from 'app/shared/components/table/table.component';
import * as FormConfig from './election-cycle-form.config';
import { TableActionsButtonComponent } from 'app/shared/components/table-actions-button/table-actions-button.component';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { MessageWrapperService } from 'app/shared/services/message-wrapper.service';
import { electionColumns } from './election-cycle-table.config';

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
    TableActionsButtonComponent,
  ],
  providers: [ElectionCycleService, BreakpointStore, MessageWrapperService],
  templateUrl: './election-cycle-list.component.html',
  styleUrl: './election-cycle-list.component.scss',
})
export class ElectionCyclesListComponent {
  readonly messageService = inject(MessageWrapperService);
  private readonly cookieService = inject(CookieService);
  protected itemService = inject(ElectionCycleService);
  readonly breakpointStore = inject(BreakpointStore);

  /* FORM PROPERTIES */
  readonly model = signal<FormConfig.ElectionCycleForm>(FormConfig.INITIAL_FORM_VALUE);
  readonly form = FormConfig.createElectionCycleForm(this.model, this.cookieService, this.handleFormSubmit.bind(this));
  readonly disableSubmission = computed(() => this.form().invalid() || this.form().submitting());
  readonly officeOptions = FormConfig.officeOptions;
  readonly electionTypeOptions = FormConfig.electionTypeOptions;

  /* TABLE PROPERTIES */
  readonly rowsPerPage = signal(5);
  readonly first = linkedSignal({ source: this.rowsPerPage, computation: () => 0 });
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

  readonly columns: Signal<ColumnDefinition<ElectionCycle>[]> = computed(() => electionColumns(this.breakpointStore));

  public rowActions: TableAction<ElectionCycle>[] = [
    new TableAction('Edit', this.editItem.bind(this)),
    new TableAction('Delete', this.deleteItem.bind(this)),
  ];

  private async handleFormSubmit(): Promise<void> {
    if (this.newItem()) await this.create();
    else await this.update();
    this.clearEditing();
    this.form().reset(FormConfig.INITIAL_FORM_VALUE);
  }

  addItem() {
    const newItem = ElectionCycle.createEmpty();
    this.newItem.set(newItem);
    this.setEditing(newItem.id);
  }

  cancelEdit() {
    this.newItem.set(null);
    this.form().reset(FormConfig.INITIAL_FORM_VALUE);
    this.clearEditing();
  }

  private editItem(cycle: ElectionCycle) {
    this.setEditing(cycle.id);
    this.form().reset({
      office: cycle.office,
      electionType: cycle.electionType,
      electionYear: cycle.electionYear,
      coverage: cycle.coverage,
    });
  }

  private async deleteItem(cycle: ElectionCycle) {
    try {
      await this.itemService.delete(cycle);
      this.electionCycleData.reload();
      this.messageService.success(`Election cycle deleted`);
    } catch {
      this.messageService.error(`There was an error deleting your new election cycle`);
    }
  }

  private async create() {
    try {
      this.newItem.set(null);
      const cycle = new ElectionCycle(this.form().value());
      await this.itemService.create(cycle);
      this.electionCycleData.reload();
      this.messageService.success(`New Election cycle created`);
    } catch (error) {
      console.log('error saving', error);
      this.messageService.error('There was an error creating your new election cycle');
    }
  }

  private async update() {
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
