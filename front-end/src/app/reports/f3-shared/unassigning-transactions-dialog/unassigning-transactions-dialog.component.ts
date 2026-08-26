import { Component, model } from '@angular/core';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-unassigning-transactions-dialog',
  imports: [DialogComponent, ButtonModule],
  templateUrl: './unassigning-transactions-dialog.component.html',
  styleUrl: './unassigning-transactions-dialog.component.scss',
})
export class UnassigningTransactionsDialogComponent {
  readonly visible = model.required<boolean>();
}
