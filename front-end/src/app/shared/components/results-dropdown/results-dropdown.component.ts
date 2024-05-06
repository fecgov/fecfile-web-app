import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-results-dropdown',
  templateUrl: './results-dropdown.component.html',
  styleUrls: ['./results-dropdown.component.scss'],
})
export class ResultsDropdownComponent {
  paginationPageSizeOptions = [5, 10, 15, 20];

  @Input() rowsPerPage = 5;
  @Output() rowsPerPageChange = new EventEmitter();
}
