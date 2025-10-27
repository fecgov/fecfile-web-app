import { Component, signal } from '@angular/core';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { FormTypeDialogComponent } from '../form-type-dialog/form-type-dialog.component';
import { Report } from 'app/shared/models';
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
}
