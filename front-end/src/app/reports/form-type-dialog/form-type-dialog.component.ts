import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { FORM_TYPES, FormType, FormTypes } from 'app/shared/utils/form-type.utils';
import { Form24Service } from 'app/shared/services/form-24.service';
import { Form24 } from 'app/shared/models/form-24.model';
import { Observable, filter, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';

@Component({
  selector: 'app-form-type-dialog',
  templateUrl: './form-type-dialog.component.html',
  styleUrls: ['./form-type-dialog.component.scss'],
})
export class FormTypeDialogComponent extends DestroyerComponent implements OnChanges, AfterViewInit, OnInit {
  formTypeOptions: FormTypes[] = Array.from(FORM_TYPES, (mapping) => mapping[0]);
  formTypes = FormTypes;
  selectedType?: FormTypes;
  committeeAccount$?: Observable<CommitteeAccount>;
  street = undefined;
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

  constructor(public router: Router, private form24Service: Form24Service, private store: Store) {
    super();
  }

  ngAfterViewInit() {
    this.dialog?.nativeElement.addEventListener('close', () => this.dialogClose.emit());
  }

  ngOnInit(): void {
    this.committeeAccount$ = this.store.select(selectCommitteeAccount).pipe(
      takeUntil(this.destroy$),
      filter((committeeAccount) => !!committeeAccount)
    );
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
    this.committeeAccount$?.subscribe((committeeAccount) => {
      const form24 = Form24.fromJSON({
        report_type_24_48: this.selectedForm24Type,
        street_1: committeeAccount.street_1,
        street_2: committeeAccount.street_2,
        city: committeeAccount.city,
        state: committeeAccount.state,
        zip: committeeAccount.zip,
        filer_committee_id_number: committeeAccount.committee_id,
        committee_name: committeeAccount.name,
      });
      const create$ = this.form24Service.create(form24, ['report_type_24_48']);

      create$.subscribe((report) => {
        this.router.navigateByUrl(`/reports/transactions/report/${report.id}/list`);
      });

      this.selectedType = undefined;
    });
  }
}
