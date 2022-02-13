import { SchedHServiceService } from './../../sched-h-service/sched-h-service.service';
import { SchedHMessageServiceService } from './../../sched-h-service/sched-h-message-service.service';
import { ScheduleActions } from './../individual-receipt/schedule-actions.enum';
import { NgForm } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  Input,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable, Subscription, Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { IndividualReceiptService } from '../../form-3x/individual-receipt/individual-receipt.service';
import { TransactionsMessageService } from '../../transactions/service/transactions-message.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-sched-h1',
  templateUrl: './sched-h1.component.html',
  styleUrls: ['./sched-h1.component.scss'],
})
export class SchedH1Component implements OnInit, OnChanges, OnDestroy {
  @Input() forceChangeDetection!: Date;
  @Input() transactionData!: any;
  @Output() status: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('f') form!: NgForm;

  public formType = '';
  public scheduleAction: ScheduleActions = ScheduleActions.add;
  populateFormForEdit!: Subscription;
  transaction_id!: any;

  getH1Subscription!: Subscription;
  getH1Disable = false;
  h1Disabled = false;
  removedH1Subscription!: Subscription;

  getH1PacSubscription!: Subscription;
  getH1PacADDisable = false;
  h1PacADDisabled = false;
  getH1PacGVDisable = false;
  h1PacGVDisabled = false;
  getH1PacPCDisable = false;
  h1PacPCDisabled = false;
  removedH1PacSubscription!: Subscription;

  pacSaveDisable = true;
  partySaveDisable = true;

  private onDestroy$ = new Subject();
  reportId!: any;

  adSelected = false;
  gvSelected = false;
  pcSelected = false;

  col: any = {
    infoText: ''
  }

  constructor(
    private _http: HttpClient,
    private _activatedRoute: ActivatedRoute,
    private _cookieService: CookieService,
    private _schedHMessageServiceService: SchedHMessageServiceService,
    private _schedHService: SchedHServiceService,
    private _individualReceiptService: IndividualReceiptService,
    private _transactionsMessageService: TransactionsMessageService,
    protected _decimalPipe: DecimalPipe
  ) {
    //console.log('h1 constructor ...');
    this.populateFormForEdit = this._schedHMessageServiceService.getpopulateHFormForEditMessage().subscribe((p) => {
      const isViewMode = p.action === 'view' ? true : false;
      if (p.scheduleType === 'Schedule H1') {
        let res = this._schedHService.getSchedule(p.transactionDetail.transactionModel).subscribe((res: any) => {
          if (res && res.length === 1) {
            this.editH1(res[0], isViewMode);
          }
        });
      }
    });

    this.removedH1Subscription = this._transactionsMessageService
      .getRemoveH1TransactionsMessage()
      .subscribe((message) => {
        if (message.scheduleType === 'Schedule H1') {
          this.getH1Disable = false;

          this.checkH1PacDisabled();

          this.scheduleAction = ScheduleActions.add;
          this.form.control.patchValue({ h1_election_year_options: '' }, { onlySelf: true });
        }
      });

    this.reportId = this._activatedRoute.snapshot.queryParams['reportId'];
  }

  ngOnInit() {
    // localStorage.setItem('cmte_type_category', 'PAC')
    ////console.log(localStorage.getItem('cmte_type_category'));
    this.formType = this._activatedRoute.snapshot.paramMap.get('form_id') ?? '';
    this.checkH1Disabled();
    this.checkH1PacDisabled();
    if (this.transactionData) {
      this._schedHMessageServiceService.sendpopulateHFormForEditMessage(this.transactionData);
    }
  }

  public ngOnChanges() {
    this._prepareForUnsavedChanges();
    this.changeH1Disable();
  }

  public ngOnDestroy(): void {
    this.populateFormForEdit.unsubscribe();
    this.getH1Subscription.unsubscribe();
    this.removedH1Subscription.unsubscribe();
    localStorage.removeItem(`form_${this.formType}_saved`);
    if (this.onDestroy$) {
      this.onDestroy$.next(true);
    }
  }

  private _prepareForUnsavedChanges(): void {
    if (this.onDestroy$) {
      this.onDestroy$.next(true);
    }
    if (this.form) {
      this.form.valueChanges?.pipe(takeUntil(this.onDestroy$)).subscribe((val) => {
        if (this.form.dirty) {
          localStorage.setItem(`form_${this.formType}_saved`, JSON.stringify({ saved: false }));
        }
      });
    }
  }

  isPac() {
    ////console.log(localStorage.getItem('cmte_type_category'));
    // return true;

    let ispac = false;
    if (localStorage.getItem('committee_details') !== null) {
      let cmteDetails: any = JSON.parse(localStorage.getItem(`committee_details`) ?? '');
      if (cmteDetails.cmte_type_category === 'PAC') {
        ispac = true;
      }
    }
    //return localStorage.getItem('cmte_type_category') === 'PAC';

    return ispac;
  }

  saveH1(f: NgForm) {
    const token: string = JSON.parse(this._cookieService.get('user'));
    const url: string = `${environment.apiUrl}/sh1/schedH1`;
    // const data: any = JSON.stringify(receipt);
    let httpOptions = new HttpHeaders();

    httpOptions = httpOptions.append('Authorization', 'JWT ' + token);
    httpOptions = httpOptions.append('Content-Type', 'application/json');

    const formData: FormData = new FormData();
    let h1_obj: any = { transaction_type_identifier: 'ALLOC_H1' };

    h1_obj['report_id'] = '0';

    let reportType: any = JSON.parse(localStorage.getItem(`form_${this.formType}_report_type`) ?? '');
    if (reportType === null || typeof reportType === 'undefined') {
      reportType = JSON.parse(localStorage.getItem(`form_${this.formType}_report_type_backup`) ?? '');
    }
    if (this.reportId) {
      h1_obj['report_id'] = this.reportId;
    } else if (reportType.hasOwnProperty('reportId')) {
      h1_obj['report_id'] = reportType.reportId;
    } else if (reportType.hasOwnProperty('reportid')) {
      h1_obj['report_id'] = reportType.reportid;
    }

    if (this.isPac()) {
      h1_obj['federal_percent'] = f.value.federal_share / 100;
      h1_obj['non_federal_percent'] = f.value.nonfederal_share / 100;
      if (f.value.applied_activity1) {
        h1_obj['administrative'] = true;
      }
      if (f.value.applied_activity2) {
        h1_obj['generic_voter_drive'] = true;
      }
      if (f.value.applied_activity3) {
        h1_obj['public_communications'] = true;
      }

      if (this.scheduleAction === ScheduleActions.add) {
        if (this.adSelected) {
          h1_obj['administrative'] = false;
        }
        if (this.gvSelected) {
          h1_obj['generic_voter_drive'] = false;
        }
        if (this.pcSelected) {
          h1_obj['public_communications'] = false;
        }
      }
    } else {
      if (f.value.h1_election_year_options === '1') {
        h1_obj['federal_percent'] = '0.28';
        h1_obj['non_federal_percent'] = '0.72';
        h1_obj['presidential_only'] = true;
      } else if (f.value.h1_election_year_options === '2') {
        h1_obj['federal_percent'] = '0.36';
        h1_obj['non_federal_percent'] = '0.64';
        h1_obj['presidential_and_senate'] = true;
      } else if (f.value.h1_election_year_options === '3') {
        h1_obj['federal_percent'] = '0.21';
        h1_obj['non_federal_percent'] = '0.79';
        h1_obj['senate_only'] = true;
      } else if (f.value.h1_election_year_options === '4') {
        h1_obj['federal_percent'] = '0.15';
        h1_obj['non_federal_percent'] = '0.85';
        h1_obj['non_pres_and_non_senate'] = true;
      }
    }

    if (this.scheduleAction === ScheduleActions.add) {
      this._http
        .post(url, JSON.stringify(h1_obj), {
          headers: httpOptions,
        })
        .subscribe((res) => {
          //console.log(res);
          f.value.message = 'h1 saved.';
          f.reset();
          localStorage.setItem(`form_${this.formType}_saved`, JSON.stringify({ saved: true }));
          this.previousStep();
        });
    } else if (this.scheduleAction === ScheduleActions.edit) {
      h1_obj['transaction_id'] = this.transaction_id;
      this._http
        .put(url, JSON.stringify(h1_obj), {
          headers: httpOptions,
        })
        .subscribe((res) => {
          //console.log(res);
          f.value.message = 'h1 saved.';
          f.reset();
          //also reset this.transaction_id so future transactions dont accidentally use it.
          this.transaction_id = null;
          this.scheduleAction = ScheduleActions.add;
          this.previousStep();
        });
    }
  }

  public editH1(item: any, isViewMode: boolean) {
    if (this.onDestroy$) {
      this.onDestroy$.next(true);
    }
    this.scheduleAction = isViewMode ? ScheduleActions.view : ScheduleActions.edit;
    this.transaction_id = item.transaction_id;

    this.pacSaveDisable = false;
    this.partySaveDisable = false;

    if (this.scheduleAction === ScheduleActions.view) {
      this.form.form.disable();
      this.h1Disabled = true;
      this.h1PacADDisabled = true;
      this.h1PacGVDisabled = true;
      this.h1PacPCDisabled = true;
    }
    this.checkH1Disabled();
    this.checkH1PacDisabled();

    if (this.isPac()) {
      this.form.control.patchValue(
        { federal_share: this._decimalPipe.transform(item.federal_percent * 100, '2.0') },
        { onlySelf: true }
      );
      this.form.control.patchValue(
        { nonfederal_share: this._decimalPipe.transform(item.non_federal_percent * 100, '2.0') },
        { onlySelf: true }
      );
      this.form.control.patchValue({ applied_activity1: item.administrative }, { onlySelf: true });
      this.form.control.patchValue({ applied_activity2: item.generic_voter_drive }, { onlySelf: true });
      this.form.control.patchValue({ applied_activity3: item.public_communications }, { onlySelf: true });

      this.getH1PacSubscription = this.getH1Pac().subscribe((res) => {
        if (res && this.isPac()) {
          if (res.administrative !== 0 && !item.administrative) {
            this.h1PacADDisabled = true;
          }

          if (res.generic_voter_drive !== 0 && !item.generic_voter_drive) {
            this.h1PacGVDisabled = true;
          }

          if (res.public_communications !== 0 && !item.public_communications) {
            this.h1PacPCDisabled = true;
          }
        }
      });
    } else {
      if (item.presidential_only) {
        this.form.control.patchValue({ h1_election_year_options: '1' }, { onlySelf: true });
      } else if (item.presidential_and_senate) {
        this.form.control.patchValue({ h1_election_year_options: '2' }, { onlySelf: true });
      } else if (item.senate_only) {
        this.form.control.patchValue({ h1_election_year_options: '3' }, { onlySelf: true });
      } else if (item.non_pres_and_non_senate) {
        this.form.control.patchValue({ h1_election_year_options: '4' }, { onlySelf: true });
      }
    }
    this._prepareForUnsavedChanges();
  }

  public handleFedShareFieldKeyup(e: any, f: NgForm) {
    if (e.target.value <= 100) {
      f.controls['nonfederal_share'].setValue(100 - e.target.value);
    } else {
      f.controls['nonfederal_share'].setValue(0);
    }
  }

  public handleOnFedBlurEvent(e: any, f: NgForm) {
    if (e.target.value <= 100) {
      f.controls['nonfederal_share'].setValue(100 - e.target.value);
    } else {
      f.controls['nonfederal_share'].setValue(0);
    }
  }

  public handleNonFedShareFieldKeyup(e: any, f: NgForm) {
    if (e.target.value <= 100) {
      f.controls['federal_share'].setValue(100 - e.target.value);
    } else {
      f.controls['federal_share'].setValue(0);
    }
  }

  public handleOnNonFedBlurEvent(e: any, f: NgForm) {
    if (e.target.value <= 100) {
      f.controls['federal_share'].setValue(100 - e.target.value);
    } else {
      f.controls['federal_share'].setValue(0);
    }
  }

  public previousStep(): void {
    this.checkH1Disabled();
    this.checkH1PacDisabled();
    this.status.emit({
      form: {},
      direction: 'previous',
      step: 'step_2',
    });
  }

  public checkH1Disabled() {
    if (this.scheduleAction === ScheduleActions.add) {
      this.getH1Subscription = this.getH1().subscribe((res) => {
        if (res.length !== 0 && !this.isPac()) {
          if (res[0].federal_percent === 0.28) {
            this.form.control.patchValue({ h1_election_year_options: '1' }, { onlySelf: true });
          } else if (res[0].federal_percent === 0.36) {
            this.form.control.patchValue({ h1_election_year_options: '2' }, { onlySelf: true });
          } else if (res[0].federal_percent === 0.21) {
            this.form.control.patchValue({ h1_election_year_options: '3' }, { onlySelf: true });
          } else if (res[0].federal_percent === 0.15) {
            this.form.control.patchValue({ h1_election_year_options: '4' }, { onlySelf: true });
          }
          // Checking the schedule action again here to ensure it is validated against the
          // latest status after the network call
          // During Edit the schedule action changes while the above network call is pending
          // Fixes issues from FNE-2374
          if (this.scheduleAction === ScheduleActions.add) {
            this.getH1Disable = true;
            this.h1Disabled = true;
          } else if (this.scheduleAction === ScheduleActions.edit) {
            this.getH1Disable = false;
            this.h1Disabled = false;
          }
        } else {
          this.getH1Disable = false;
          this.h1Disabled = false;
        }
      });
      //this.h1Disabled = this.getH1Disable;
      //this.h1Disabled = true;
    } else {
      this.h1Disabled = false;
    }
  }

  public getH1(): Observable<any> {
    const reportId = this.reportId
      ? this.reportId
      : this._individualReceiptService.getReportIdFromStorage(this.formType);
    const token: string = JSON.parse(this._cookieService.get('user'));
    const url: string = `${environment.apiUrl}/sh1/schedH1`;

    let httpOptions = new HttpHeaders();
    httpOptions = httpOptions.append('Authorization', 'JWT ' + token);
    httpOptions = httpOptions.append('Content-Type', 'application/json');

    let params = new HttpParams();
    params = params.append('report_id', reportId);

    return this._http
      .get(url, {
        params,
        headers: httpOptions,
      })
      .pipe(
        map((res: any) => {
          if (res) {
            //console.log('Get H1 res: ', res);
            return res;
          }
          return false;
        })
      );
  }

  public changeH1Disable() {
    if (this._activatedRoute.snapshot.queryParams['step'] === 'step_2') {
      this.h1Disabled = this.getH1Disable;
      this.h1PacADDisabled = this.getH1PacADDisable;
      this.h1PacGVDisabled = this.getH1PacGVDisable;
      this.h1PacPCDisabled = this.getH1PacPCDisable;

      if (this.scheduleAction === ScheduleActions.add) {
        if (this.form.value.federal_share) {
          this.form.control.patchValue({ federal_share: null }, { onlySelf: true });
        }
        if (this.form.value.federal_share) {
          this.form.control.patchValue({ nonfederal_share: null }, { onlySelf: true });
        }

        if (!this.h1PacADDisabled) {
          this.form.control.patchValue({ applied_activity1: null }, { onlySelf: true });
        }

        if (!this.h1PacGVDisabled) {
          this.form.control.patchValue({ applied_activity2: null }, { onlySelf: true });
        }

        if (!this.h1PacPCDisabled) {
          this.form.control.patchValue({ applied_activity3: null }, { onlySelf: true });
        }
      } else if (this.scheduleAction === ScheduleActions.edit) {
        this.form.reset();
        this.scheduleAction = ScheduleActions.add;
        this.checkH1PacDisabled();
      }

      this.pacSaveDisable = true;
      this.partySaveDisable = true;
    }
  }

  public checkH1PacDisabled() {
    if (this.scheduleAction === ScheduleActions.add) {
      this.getH1PacSubscription = this.getH1Pac().subscribe((res) => {
        if (res && this.isPac()) {
          if (res.administrative !== 0) {
            this.form.control.patchValue({ applied_activity1: 'administrative' }, { onlySelf: true });
            this.getH1PacADDisable = true;
            this.adSelected = true;
            if (this.scheduleAction === ScheduleActions.add) {
              this.h1PacADDisabled = true;
            }
          } else {
            this.form.control.patchValue({ applied_activity1: '' }, { onlySelf: true });
            this.getH1PacADDisable = false;
          }

          if (res.generic_voter_drive !== 0) {
            this.form.control.patchValue({ applied_activity2: 'generic_voter_drive' }, { onlySelf: true });
            this.getH1PacGVDisable = true;
            this.gvSelected = true;
            if (this.scheduleAction === ScheduleActions.add) {
              this.h1PacGVDisabled = true;
            }
          } else {
            this.form.control.patchValue({ applied_activity2: '' }, { onlySelf: true });
            this.getH1PacGVDisable = false;
          }

          if (res.public_communications !== 0) {
            this.form.control.patchValue({ applied_activity3: 'public_communications' }, { onlySelf: true });
            this.getH1PacPCDisable = true;
            this.pcSelected = true;
            if (this.scheduleAction === ScheduleActions.add) {
              this.h1PacPCDisabled = true;
            }
          } else {
            this.form.control.patchValue({ applied_activity3: '' }, { onlySelf: true });
            this.getH1PacPCDisable = false;
          }
        } else {
          this.getH1PacADDisable = false;
          this.getH1PacGVDisable = false;
          this.getH1PacPCDisable = false;
        }
      });
      this.h1PacADDisabled = this.getH1PacADDisable;
      this.h1PacGVDisabled = this.getH1PacGVDisable;
      this.h1PacPCDisabled = this.getH1PacPCDisable;
    } else {
      this.h1PacADDisabled = false;
      this.h1PacGVDisabled = false;
      this.h1PacPCDisabled = false;
    }
  }

  public getH1Pac(): Observable<any> {
    const reportId = this.reportId
      ? this.reportId
      : this._individualReceiptService.getReportIdFromStorage(this.formType);
    const token: string = JSON.parse(this._cookieService.get('user'));
    const url: string = `${environment.apiUrl}/sh1/validate_pac_h1`;

    let httpOptions = new HttpHeaders();
    httpOptions = httpOptions.append('Authorization', 'JWT ' + token);
    httpOptions = httpOptions.append('Content-Type', 'application/json');

    let params = new HttpParams();
    params = params.append('report_id', reportId);

    return this._http
      .get(url, {
        params,
        headers: httpOptions,
      })
      .pipe(
        map((res: any) => {
          if (res) {
            //console.log('Get H1 Pac res: ', res);
            return res;
          }
          return false;
        })
      );
  }

  public clickPacOptions(e: any) {
    if (
      (!this.form.value.applied_activity1 && e.target.value === 'administrative') ||
      (!this.form.value.applied_activity2 && e.target.value === 'generic_voter_drive') ||
      (!this.form.value.applied_activity3 && e.target.value === 'public_communication')
    ) {
      this.pacSaveDisable = false;
    } else if (
      (!this.form.value.applied_activity2 &&
        !this.form.value.applied_activity3 &&
        this.form.value.applied_activity1 &&
        e.target.value === 'administrative') ||
      (!this.form.value.applied_activity1 &&
        !this.form.value.applied_activity3 &&
        this.form.value.applied_activity2 &&
        e.target.value === 'generic_voter_drive') ||
      (!this.form.value.applied_activity1 &&
        !this.form.value.applied_activity2 &&
        this.form.value.applied_activity3 &&
        e.target.value === 'public_communication')
    ) {
      this.pacSaveDisable = true;
    }
  }

  public clickPartyOptions(e: any) {
    if (this.scheduleAction === ScheduleActions.add) {
      if (e.target.value) {
        this.partySaveDisable = false;
      } else {
        this.partySaveDisable = true;
      }
    } else if (this.scheduleAction === ScheduleActions.edit) {
      this.partySaveDisable = false;
    }
  }
}
