import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { refreshCommitteeAccountDetailsAction } from 'app/store/committee-account.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  // styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(refreshCommitteeAccountDetailsAction());
  }

}
