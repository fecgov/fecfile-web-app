import { Component, Input, OnInit, ElementRef } from '@angular/core';

/**
 * A component for the Category Type filter options.
 */
@Component({
  selector: 'app-contacts-filter-type',
  templateUrl: './contacts-filter-type.component.html',
  styleUrls: ['./contacts-filter-type.component.scss'],
})
export class ContactsFilterTypeComponent implements OnInit {
  @Input()
  public categoryType: any;

  public constructor(public elRef: ElementRef) {}

  /**
   * Init the component.
   */
  public ngOnInit(): void {
    this.clearHighlight();
  }

  /**
   * When an option is clicked, remove any highlighting applied by
   * the search scroll feature.
   */
  public clickTypeOption() {
    this.clearHighlight();
  }

  /**
   * Remove the highlighting.
   */
  private clearHighlight() {
    this.categoryType.highlight = '';
  }
}
