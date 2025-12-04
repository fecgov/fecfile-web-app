import { Component, input } from '@angular/core';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ConfirmDialog, DialogComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  readonly key = input.required<string>();
}
