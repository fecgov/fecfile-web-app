import { Component, signal, computed, viewChild } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { FormTypeDialogComponent } from '../form-type-dialog/form-type-dialog.component';
import { Form3XListComponent } from './form3x-list/form3x-list.component';
import { Form99ListComponent } from './form99-list/form99-list.component';
import { Form1MListComponent } from './form1m-list/form1m-list.component';
import { environment } from 'environments/environment';
import { Form3ListComponent } from './form3-list/form3-list.component';
import { Form24ListComponent } from './form24-list/form24-list.component';

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

  readonly form3xList = viewChild(Form3XListComponent);
  readonly form3List = viewChild(Form3ListComponent);
  readonly form99List = viewChild(Form99ListComponent);
  readonly form1mList = viewChild(Form1MListComponent);
  readonly form24List = viewChild(Form24ListComponent);

  readonly viewInitialized = signal(false);

  readonly showEmptyState = computed(() => {
    const allLoaded =
      !this.form3xList()?.loading() &&
      !this.form3List()?.loading() &&
      !this.form99List()?.loading() &&
      !this.form1mList()?.loading() &&
      !this.form24List()?.loading();

    if (!allLoaded) return false;

    return ![
      this.form3xList()?.totalItems(),
      this.form3List()?.totalItems(),
      this.form99List()?.totalItems(),
      this.form1mList()?.totalItems(),
      this.form24List()?.totalItems(),
    ].some((total) => total && total > 0);
  });
}
