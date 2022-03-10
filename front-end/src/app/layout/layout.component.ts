import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommitteeAccountsService } from 'app/shared/services/committee-accounts.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit {
  public committeeName: string | null = null;
  public committeeId: string | null = null;

  constructor(private committeeAccountsService: CommitteeAccountsService) {}

  ngOnInit(): void {
    this.committeeAccountsService.getDetails().subscribe((res: any) => {
      if (res) {
        localStorage.setItem('committee_details', JSON.stringify(res));

        this.committeeName = res.committeename;
        this.committeeId = res.committeeid;
      }
    });
  }
}
