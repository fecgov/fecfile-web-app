import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-consent-modal',
  templateUrl: './consent-modal.component.html',
  styleUrls: ['./consent-modal.component.scss'],
})
export class ConsentModalComponent {
  constructor(private activeModal: NgbActiveModal) {}

  decline() {
    this.activeModal.close('decline');
  }

  agree() {
    this.activeModal.close('agree');
  }
}
