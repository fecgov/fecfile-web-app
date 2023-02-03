import { Component, OnInit, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-additional-info-input',
  templateUrl: './additional-info-input.component.html',
  styleUrls: ['./additional-info-input.component.scss'],
})
export class AdditionalInfoInputComponent extends BaseInputComponent implements OnInit {
  @Input() descriptionIsSystemGenerated = false;
  @Input() contributionPurposeDescriptionLabel = '';
  @Input() purposeDescriptionLabelNotice?: string;
  @Input() purposeFieldTitle?: string; //Specifies a specific title for the CPD field
  @Input() schedule?: 'A' | 'B'; //Specifies a schedule so that a default CPD title can be used

  ngOnInit(): void {
    if (!this.purposeFieldTitle) {
      this.purposeFieldTitle = this.getPurposeFieldTitle();
    }
  }

  public getPurposeFieldTitle() {
    switch (this.schedule) {
      case 'A':
        return 'Purpose of Receipt';
    }
    return 'Contribution Purpose Description';
  }
}
