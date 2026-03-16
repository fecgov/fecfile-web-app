import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ContactTypes } from 'app/shared/models/contact.model';
import { ContactSearchComponent } from '../contact-search/contact-search.component';
import { ContactManagementService } from 'app/shared/services/contact-management.service';
import { buildDataCy } from 'app/shared/utils/data-cy.utils';

@Component({
  selector: 'app-report-contact-lookup',
  templateUrl: './report-contact-lookup.component.html',
  styleUrls: ['./report-contact-lookup.component.scss'],
  imports: [ContactSearchComponent],
})
export class ReportContactLookupComponent implements OnInit {
  readonly cmservice = inject(ContactManagementService);
  readonly key = input('contact_1');
  readonly form = input.required<FormGroup>();
  readonly formSubmitted = input.required<boolean>();
  readonly contactType = input.required<ContactTypes>();

  readonly manager = computed(() => this.cmservice.get(this.key()));
  readonly rootDataCy = computed(() => buildDataCy('report-contact-lookup', this.key(), 'panel'));
  readonly contactSearchDataCy = computed(() => buildDataCy('report-contact-lookup', this.key(), 'search', 'panel'));
  readonly addContactDataCy = computed(() => buildDataCy('report-contact-lookup', this.key(), 'add-contact', 'text'));
  readonly addContactContainerDataCy = computed(() =>
    buildDataCy('report-contact-lookup', this.key(), 'add-contact', 'container'),
  );
  readonly createContactDataCy = computed(() =>
    buildDataCy('report-contact-lookup', this.key(), 'create-contact', 'link'),
  );
  readonly contactSearchContext = computed(() => buildDataCy('report-contact-lookup', this.key()));

  ngOnInit(): void {
    this.manager().setAsSingle(this.contactType());
  }

  openDialog() {
    this.cmservice.activeKey.set(this.key());
    this.cmservice.showDialog.set(true);
  }
}
