import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [{ label: 'My Forms' }, { label: 'Other Forms' }];
  }
}
