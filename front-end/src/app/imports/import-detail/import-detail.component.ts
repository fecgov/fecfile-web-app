import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { MessageService } from 'primeng/api';
import { ImportService } from 'app/shared/services/import.service';
import { ActivatedRoute } from '@angular/router';
import { Import } from 'app/shared/models/import.model';
import { SelectModule } from 'primeng/select';
import { ContactType, ScheduleATransactionTypeLabels } from 'app/shared/models';
import { ButtonModule } from 'primeng/button';
import { LabelList, LabelUtils } from 'app/shared/utils/label.utils';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';

@Component({
  selector: 'app-import-detail',
  templateUrl: './import-detail.component.html',
  styleUrl: './import-detail.component.scss',
  imports: [ReactiveFormsModule, SelectModule, ButtonModule],
})
export class ImportDetailComponent extends DestroyerComponent {
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly importService = inject(ImportService);

  public transactions: any[];
  public all_transactions: any[] = [];
  public import_obj: Import;
  public transaction_types = LabelUtils.getPrimeOptions(ScheduleATransactionTypeLabels);

  constructor() {
    super();
    this.import_obj = this.activatedRoute.snapshot.data['import_obj'];
    this.transactions = (this.import_obj.preprocessed_json as any).transactions;
    for (const transaction of this.transactions) {
      this.all_transactions.push(transaction);
      for (const child of transaction.children) {
        child['temp_p_id'] = transaction.transaction_id;
        this.all_transactions.push(child);
        for (const grandchild of child.children) {
          grandchild['temp_p_id'] = child.transaction_id;
          this.all_transactions.push(grandchild);
        }
      }
    }
  }

  public async approve_and_import() {
    for (const transaction of this.all_transactions) {
      delete transaction['temp_p_id'];
    }

    const import$ = this.importService.approveForImport(this.import_obj);
    const new_import = await import$;

    if (new_import.report) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Imported Successfully',
        life: 3000,
      });
      this.router.navigateByUrl(`/reports/transactions/report/${new_import.report}/list`);
    }
  }

  public filterForEntityType(entity_type: string, labelList: LabelList) {
    return labelList.filter((value) => {
      const transactionType = TransactionTypeUtils.factory(value[0]);
      return transactionType.contactTypeOptions?.includes(entity_type as ContactType);
    });
  }

  public get_filtered_types(entity_type: string) {
    const filtered_list = this.filterForEntityType(entity_type, ScheduleATransactionTypeLabels);
    return LabelUtils.getPrimeOptions(filtered_list);
  }

  public set_tti(event: any, transaction: any) {
    transaction.transaction_type_identifier = event.value;
  }
}
