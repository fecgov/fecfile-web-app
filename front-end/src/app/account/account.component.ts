import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IAccount } from './account';
import { AccountService } from './account.service';
import { DialogService } from '../shared/services/DialogService/dialog.service';
import { ConfirmModalComponent, ModalHeaderClassEnum } from '../shared/partials/confirm-modal/confirm-modal.component';
import { AuthService } from '../shared/services/AuthService/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [AccountService],
})
export class AccountComponent implements OnInit, OnDestroy {
  accounts: IAccount | null = null;
  public showSideBar: boolean = true;
  public showLegalDisclaimer: boolean = false;
  public levin_accounts: any[] = [];
  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  public levinAction = 'add';
  public levinsSubscription: Subscription | null = null;
  public editLevinAccountId: string | null = null;

  constructor(
    private accountService: AccountService,
    private http: HttpClient,
    private cookieService: CookieService,
    private dialogService: DialogService,
    public authService: AuthService
  ) {
    this.getLevinAccounts()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res: any) => {
        //console.log(res);
        if (res) {
          this.levin_accounts = res;
        }
      });
  }

  public toggleSideNav(): void {
    if (this.showSideBar) {
      this.showSideBar = false;
    } else if (!this.showSideBar) {
      this.showSideBar = true;
    }
  }

  public open(): void {
    this.showLegalDisclaimer = !this.showLegalDisclaimer;
  }

  ngOnInit() {
    this.accountService
      .getAccounts()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res: any) => (this.accounts = <IAccount>res));
  }

  goToForms1() {
    window.open('https://webforms.fec.gov/webforms/form1/index.htm', '_blank');
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

  // TODO: later on to refactor to move http service to a dedicated service module

  saveLevinAccount(levin_name: HTMLInputElement) {
    const token: string = JSON.parse(this.cookieService.get('user'));
    const url: string = `${environment.apiUrl}/core/levin_accounts`;
    let httpOptions = new HttpHeaders();

    httpOptions = httpOptions.append('Authorization', 'JWT ' + token);
    httpOptions = httpOptions.append('Content-Type', 'application/json');
    let levin_acct = { levin_account_name: levin_name.value };
    this.http
      .post(url, JSON.stringify(levin_acct), {
        headers: httpOptions,
      })
      .subscribe((res: any) => {
        levin_acct['levin_account_name'] = res[0].levin_account_name;
        this.levin_accounts.splice(0, 0, levin_acct);
      });
    // reset levin name field
    levin_name.value = '';
  }

  private getLevinAccounts(): Observable<any> {
    const token: string = JSON.parse(this.cookieService.get('user'));
    const url: string = `${environment.apiUrl}/core/levin_accounts`;
    // const data: any = JSON.stringify(receipt);
    let httpOptions = new HttpHeaders();

    httpOptions = httpOptions.append('Authorization', 'JWT ' + token);
    httpOptions = httpOptions.append('Content-Type', 'application/json');
    //console.log('levin url:' + url);
    return this.http.get(url, {
      headers: httpOptions,
      // params: {
      //   report_id: receipt.report_id
      // }
    });
  }

  public editLevinAccount(levin: any) {
    this.levinAction = 'edit';

    (<HTMLInputElement>document.getElementById('levin_acct_name')).value = levin.levin_account_name;
    this.editLevinAccountId = levin.levin_account_id;

    this.levin_accounts = this.levin_accounts.filter((obj) => obj.levin_account_id !== levin.levin_account_id);
  }

  public saveEdit(levin_name: HTMLInputElement) {
    const token: string = JSON.parse(this.cookieService.get('user'));
    const url: string = `${environment.apiUrl}/core/levin_accounts`;

    let httpOptions = new HttpHeaders();

    httpOptions = httpOptions.append('Authorization', 'JWT ' + token);
    httpOptions = httpOptions.append('Content-Type', 'application/json');

    let levin_acct = {
      levin_account_id: this.editLevinAccountId,
      levin_account_name: levin_name.value,
    };

    this.http
      .put(url, JSON.stringify(levin_acct), {
        headers: httpOptions,
      })
      .subscribe((res) => {
        this.resetToAddLevin();

        this.editLevinAccountId = '';
      });
  }

  public cancelEditLevinAccount() {
    this.resetToAddLevin();
  }

  private resetToAddLevin() {
    this.levinsSubscription = this.getLevinAccounts().subscribe((message) => {
      this.levin_accounts = message;
    });
    this.levinAction = 'add';
    (<HTMLInputElement>document.getElementById('levin_acct_name')).value = '';
  }

  public trashLevinAccount(levin: any) {
    this.dialogService
      .confirm(
        'You are about to delete this levin account ' + levin.levin_account_name + '.',
        ConfirmModalComponent,
        'Caution!'
      )
      .then((res) => {
        if (res === 'okay') {
          this.trahAction(levin.levin_account_id);

          this.levin_accounts = this.levin_accounts.filter((obj) => obj.levin_account_id !== levin.levin_account_id);
          this.dialogService.confirm(
            'Transaction has been successfully deleted. ' + levin.levin_account_name,
            ConfirmModalComponent,
            'Success!',
            false,
            ModalHeaderClassEnum.successHeader
          );
        } else if (res === 'cancel') {
        }
      });
  }

  public trahAction(levin_account_id: string) {
    const token: string = JSON.parse(this.cookieService.get('user'));
    const url: string = `${environment.apiUrl}/core/levin_accounts`;

    let httpOptions = new HttpHeaders();

    httpOptions = httpOptions.append('Authorization', 'JWT ' + token);
    httpOptions = httpOptions.append('Content-Type', 'application/json');

    let params = new HttpParams();
    params = params.append('levin_account_id', levin_account_id);

    this.http
      .delete(url, {
        params,
        headers: httpOptions,
      })
      .subscribe((res) => {
        this.resetToAddLevin();
      });
  }
}
