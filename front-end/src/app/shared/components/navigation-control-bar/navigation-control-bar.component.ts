import { Component, Input } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import {
  NavigationControl,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';

@Component({
  selector: 'app-navigation-control-bar',
  templateUrl: './navigation-control-bar.component.html',
  styleUrls: ['./navigation-control-bar.component.scss'],
})
export class NavigationControlBarComponent {
  @Input() navigationControls: TransactionNavigationControls = new TransactionNavigationControls();
  @Input() transaction?: Transaction;

  getNavigationControls(section: 'inline' | 'cancel' | 'continue'): NavigationControl[] {
    return this.navigationControls.getNavigationControls(section, this.transaction);
  }
}
