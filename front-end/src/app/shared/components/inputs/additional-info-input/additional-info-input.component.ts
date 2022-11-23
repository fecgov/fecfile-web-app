import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-additional-info-input',
  templateUrl: './additional-info-input.component.html',
  styleUrls: ['./additional-info-input.component.scss'],
})
export class AdditionalInfoInputComponent extends BaseInputComponent {
  @Input() descriptionIsSystemGenerated = false;
}
