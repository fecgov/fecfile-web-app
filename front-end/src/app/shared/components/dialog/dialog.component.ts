import { Component, effect, ElementRef, input, model, output, ViewChild } from '@angular/core';
import { Form } from '@angular/forms';
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

  constructor() {
    effect(() => {
      const visible = this.visible();
      if (visible) {
        this.dialog.nativeElement.showModal();
      } else {
        this.dialog.nativeElement.close();
      }
    });
  }

  readonly detailClose = output<void>();
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  ngAfterViewInit() {
    this.dialog?.nativeElement.addEventListener('close', () => this.detailClose.emit());
  }
}
