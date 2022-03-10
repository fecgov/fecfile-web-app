import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../shared/services/APIService/api.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit {
  public committeeName: string | null = null;
  public committeeId: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCommiteeDetails().subscribe((res) => {
      if (res) {
        localStorage.setItem('committee_details', JSON.stringify(res));

        this.committeeName = res.committeename;
        this.committeeId = res.committeeid;
      }
    });
  }
}
