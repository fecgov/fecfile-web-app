import { Component } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-name-input',
  templateUrl: './name-input.component.html',
  styleUrls: ['./name-input.component.scss'],
})
export class NameInputComponent extends BaseInputComponent {}
