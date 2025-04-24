import { Component, input } from '@angular/core';
import { Transaction } from 'app/shared/models/transaction.model';
import {
  NavigationControl,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';
import { NavigationControlComponent } from '../navigation-control/navigation-control.component';

@Component({
  selector: 'app-navigation-control-bar',
  templateUrl: './navigation-control-bar.component.html',
  styleUrls: ['./navigation-control-bar.component.scss'],
  imports: [NavigationControlComponent],
})
export class NavigationControlBarComponent {
  readonly navigationControls = input(new TransactionNavigationControls());
  readonly transaction = input.required<Transaction>();

  getNavigationControls(section: 'inline' | 'cancel' | 'continue'): NavigationControl[] {
    return this.navigationControls().getNavigationControls(section, this.transaction());
  }
}
