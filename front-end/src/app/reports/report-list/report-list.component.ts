import { Component, viewChildren, signal, computed } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { FormTypeDialogComponent } from '../form-type-dialog/form-type-dialog.component';
import { Form3XListComponent } from './form3x-list/form3x-list.component';
import { Form99ListComponent } from './form99-list/form99-list.component';
import { Form1MListComponent } from './form1m-list/form1m-list.component';
import { Form24ListComponent } from './form24-list/form24-list.component';
import { environment } from 'environments/environment';
import { Form3ListComponent } from './form3-list/form3-list.component';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
  imports: [
    FormTypeDialogComponent,
    Toolbar,
    ButtonModule,
    Ripple,
    Form3XListComponent,
    Form99ListComponent,
    Form1MListComponent,
    Form24ListComponent,
    Form3ListComponent,
  ],
})
export class ReportListComponent {
  readonly dialogVisible = signal(false);
  readonly showForm3 = environment.showForm3;

  readonly form3xList = viewChildren(Form3XListComponent);
  readonly form3List = viewChildren(Form3ListComponent);
  readonly form99List = viewChildren(Form99ListComponent);
  readonly form1mList = viewChildren(Form1MListComponent);
  readonly form24List = viewChildren(Form24ListComponent);

  readonly showEmptyState = computed(() => {
    const lists = [
      ...this.form3xList(),
      ...this.form3List(),
      ...this.form99List(),
      ...this.form1mList(),
      ...this.form24List(),
    ];

    if (!lists.length) return false;

    return lists.every((list) => list.totalItems() === 0);
  });
}
