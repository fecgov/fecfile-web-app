import { AuthService } from '../shared/services/AuthService/auth.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../shared/services/SessionService/session.service';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  @ViewChild('content') content: any;

  public showSideBar: boolean = true;
  public showLegalDisclaimer: boolean = false;
  public!: string;
  modalRef!: any;

  upcomingReportsList: any = null;
  upcomingReportsListError = false;
  upcomingReportsListEmpty = false;
  recentlySavedReports!: any;
  recentlySavedReportsError = false;
  recentlySavedReportsEmpty = false;
  recentlySubmittedReports!: any;
  recentlySubmittedReportsError = false;
  recentlySubmittedReportsEmpty = false;
  cmte_id!: string;

  constructor(
    private _sessionService: SessionService,
    private _apiService: ApiService,
    private modalService: NgbModal,
    private _authService: AuthService
  ) {}

  ngOnInit(): void {
    // if (localStorage.getItem('form3XReportInfo.showDashBoard') === 'Y') {
    //   this._formService.removeFormDashBoard('3X');
    // }
    const committeeDetails: any = localStorage.getItem('committee_details') ?? '';
    if (committeeDetails) {
      this.cmte_id = JSON.parse(committeeDetails).committeeid;
    }
    this._showFirstTimeCOHIfAppliable();
    this._populateUpcomingReportsList();
    this._populateRecentlySavedReportsList();
    this._populateRecentlySubmittedReportsList();
  }

  private _populateRecentlySubmittedReportsList() {
    //reset flags first
    this.recentlySubmittedReportsEmpty = false;
    this.recentlySubmittedReportsError = false;
  }

  private _populateRecentlySavedReportsList() {
    //reset flags first
    this.recentlySavedReportsEmpty = false;
    this.recentlySavedReportsError = false;
  }

  private _populateUpcomingReportsList() {
    //reset flags first
    this.upcomingReportsListEmpty = false;
    this.upcomingReportsListError = false;
  }

  private _showFirstTimeCOHIfAppliable() {}

  public openCOHInfoModal(content: any) {
    this.modalRef = this.modalService.open(content, { size: 'lg', centered: true, windowClass: 'custom-class' });
  }

  public openModal() {
    // if (this.loggedInUserRole === Roles.Editor || this.loggedInUserRole === Roles.Reviewer) {
    // this._authService.showPermissionDeniedMessage();
    // } else {
    this.openCOHInfoModal(this.content);
    // }
  }

  /**
   * Show's or hides the sidebar navigation.
   */
  public toggleSideNav(): void {
    if (this.showSideBar) {
      this.showSideBar = false;
    } else if (!this.showSideBar) {
      this.showSideBar = true;
    }
  }

  /**
   * Logs a user out.
   */
  public logout(): void {
    this._sessionService.destroy();
  }

  /**
   * Open's the legal disclaimer modal dialog.
   *
   * @param      {Object}  content  The content
   */
  public open(): void {
    this.showLegalDisclaimer = !this.showLegalDisclaimer;
    /*this._modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this._getDismissReason(reason)}`;
    });*/
  }

  /**
   * Gets the dismiss reason.
   *
   * @param      {Any}  reason  The reason
   * @return     {<type>}  The dismiss reason.
   */
  private _getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
