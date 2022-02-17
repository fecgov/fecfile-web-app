import { Component, OnInit } from '@angular/core';
import { FormsService } from '../shared/services/FormsService/forms.service';

@Component({
  selector: 'app-tools-merge-names',
  templateUrl: './tools-merge-names.component.html',
  styleUrls: ['./tools-merge-names.component.scss'],
})
export class ToolsMergeNamesComponent implements OnInit {
  constructor(private _formService: FormsService) {}

  ngOnInit() {
    this._formService.clearDashBoardReportFilterOptions();

    if (localStorage.getItem('form3XReportInfo.showDashBoard') === 'Y') {
      this._formService.removeFormDashBoard('3X');
    }
  }
}
