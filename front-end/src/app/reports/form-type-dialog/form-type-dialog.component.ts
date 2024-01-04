import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FORM_TYPES, FormType, FormTypes } from 'app/shared/utils/form-type.utils';

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
  styleUrls: ['./form-type-dialog.component.scss'],
})
export class FormTypeDialogComponent implements OnChanges, AfterViewInit {
  formTypeOptions: FormTypes[] = Array.from(FORM_TYPES, (mapping) => mapping[0]);
  selectedType?: FormTypes;
  @Input() noReports = true;
  @Input() dialogVisible = false;
  @Output() dialogClose = new EventEmitter<undefined>();
  @ViewChild('dialog') dialog?: ElementRef;

  constructor(public router: Router) {
  }

  ngAfterViewInit() {
    this.dialog?.nativeElement.addEventListener('close', () => this.dialogClose.emit());
  }

  ngOnChanges(): void {
    if (this.dialogVisible) {
      this.dialog?.nativeElement.showModal();
    }
  }

  goToReportForm(): void {
    this.dialog?.nativeElement.close();
    this.router.navigateByUrl(this.getFormType(this.selectedType)?.createRoute || '');
  }

  getFormType(type?: FormTypes): FormType | undefined {
    return type ? FORM_TYPES.get(type) : undefined;
  }

  get dropdownButtonText(): string {
    if (this.selectedType) {
      const type = this.getFormType(this.selectedType);
      return `<span class="option"><b>${type?.label}:</b> ${type?.description}</span>`;
    } else {
      return '<span></span>';
    }
  }

  updateSelected(type: FormTypes) {
    this.selectedType = type;
  }


}
