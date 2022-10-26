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
  @Input() disabled: boolean = false;
  @Output() navigate: EventEmitter<NavigationControl> = new EventEmitter<NavigationControl>();

  isVisible: boolean = true;

  constructor() {}

  ngOnInit(): void {}

  click(): void {
    this.navigate.emit(this.navigationControl);
  }
}
