import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FORM_TYPES, FormType, FormTypes } from 'app/shared/utils/form-type.utils';
import { Form24Service } from 'app/shared/services/form-24.service';
import { Form24 } from 'app/shared/models/form-24.model';

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
  styleUrls: ['./form-type-dialog.component.scss'],
})
export class FormTypeDialogComponent implements OnChanges, AfterViewInit {
  formTypeOptions: FormTypes[] = Array.from(FORM_TYPES, (mapping) => mapping[0]);
  formTypes = FormTypes;
  selectedType?: FormTypes;
  @Input() noReports = true;
  @Input() dialogVisible = false;
  @Output() dialogClose = new EventEmitter<undefined>();
  @ViewChild('dialog') dialog?: ElementRef;

  @Output() refreshReports = new EventEmitter();

  form24Options = [
    {
      value: '24',
      label: '24 Hour',
    },
    {
      value: '48',
      label: '48 Hour',
    },
  ];
  selectedForm24Type: '24' | '48' | undefined;

  constructor(public router: Router, private form24Service: Form24Service) {}

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
    if (this.getFormType(this.selectedType)?.createRoute) {
      this.router.navigateByUrl(this.getFormType(this.selectedType)?.createRoute || '');
    } else if (this.selectedType === FormTypes.F24) {
      this.createForm24();
    }
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

  createForm24() {
    const form24 = Form24.fromJSON({
      report_type_24_48: this.selectedForm24Type,
    });
    const create$ = this.form24Service.create(form24, ['report_type_24_48']);

    create$.subscribe((report) => {
      this.refreshReports.emit(report);
    });

    this.selectedType = undefined;
  }
}
