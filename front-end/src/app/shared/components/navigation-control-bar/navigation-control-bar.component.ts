import { Component, computed, input } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import type { TransactionNavigationControls } from 'app/shared/models/transaction-navigation-controls.model';
import { NavigationControlComponent } from '../navigation-control/navigation-control.component';

@Component({
  selector: 'app-navigation-control-bar',
  templateUrl: './navigation-control-bar.component.html',
  styleUrls: ['./navigation-control-bar.component.scss'],
  imports: [NavigationControlComponent],
})
export class NavigationControlBarComponent {
  readonly navigationControls = input.required<TransactionNavigationControls>();
  readonly transaction = input<Transaction | undefined>(undefined);
  readonly cancelControls = computed(() =>
    this.navigationControls().getNavigationControls('cancel', this.transaction()),
  );
  readonly continueControls = computed(() =>
    this.navigationControls().getNavigationControls('continue', this.transaction()),
  );
}
