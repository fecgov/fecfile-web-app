import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import {
  NavigationControl,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';

@Component({
  selector: 'app-navigation-control-bar',
  templateUrl: './navigation-control-bar.component.html',
  styleUrls: ['./navigation-control-bar.component.scss'],
})
export class NavigationControlBarComponent implements OnInit {
  @Input() navigationControls: TransactionNavigationControls = new TransactionNavigationControls();
  @Input() transaction?: Transaction;
  @Output() navigate: EventEmitter<NavigationControl> = new EventEmitter<NavigationControl>();

  constructor() {}

  ngOnInit(): void {}

  getNavigationControls(section: 'inline' | 'cancel' | 'continue'): NavigationControl[] {
    let controls: NavigationControl[] = [];
    if (section === 'inline') {
      controls = this.navigationControls.inlineControls || [];
    } else if (section === 'cancel') {
      controls = this.navigationControls.cancelControls || [];
    } else if (section === 'continue') {
      controls = this.navigationControls.continueControls || [];
    }
    return controls.filter((control: NavigationControl) => {
      return !control.visibleCondition || control.visibleCondition(this.transaction);
    });
  }

  handleNavigate(navigationControl: NavigationControl): void {
    this.navigate.emit(navigationControl);
  }
}
