import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { NavigationControl } from 'app/shared/models/transaction-navigation-controls.model';

@Component({
  selector: 'app-navigation-control',
  templateUrl: './navigation-control.component.html',
})
export class NavigationControlComponent implements OnInit {
  @Input() navigationControl?: NavigationControl;
  @Input() transaction?: Transaction;
  @Output() navigate: EventEmitter<NavigationControl> = new EventEmitter<NavigationControl>();

  isVisible: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  isDisabled(): boolean {
    return !!this.navigationControl?.disabledCondition(this.transaction);
  }

  click(): void {
    this.navigate.emit(this.navigationControl);
  }
}
