import { Component, Input, OnInit } from '@angular/core';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { NavigationControl } from 'app/shared/models/transaction-navigation-controls.model';

@Component({
  selector: 'app-navigation-control',
  templateUrl: './navigation-control.component.html',
  styleUrls: ['./navigation-control.component.scss'],
})
export class NavigationControlComponent implements OnInit {
  @Input() navigationControl?: NavigationControl;
  @Input() transaction?: Transaction;

  constructor() {}

  ngOnInit(): void {}
}
