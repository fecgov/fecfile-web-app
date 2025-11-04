import { Component, effect, ElementRef, input, model, output, viewChild } from '@angular/core';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-dialog',
  imports: [ButtonDirective],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  readonly title = input.required<string>();
  readonly submitLabel = input('Save');
  readonly visible = model.required<boolean>();
  readonly userAdded = output<string>();
  readonly submitForm = output<void>();
  readonly detailClose = output<void>();

  readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const visible = this.visible();
      if (visible) {
        this.dialog().nativeElement.showModal();
      } else {
        this.dialog().nativeElement.close();
        this.detailClose.emit();
      }
    });
  }
}
