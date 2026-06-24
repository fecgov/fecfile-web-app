import { Component, computed, input, model, output } from '@angular/core';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { ContactSearchComponent } from '../contact-search/contact-search.component';
import { ButtonDirective } from 'primeng/button';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-report-contact-lookup',
  templateUrl: './report-contact-lookup.component.html',
  styleUrls: ['./report-contact-lookup.component.scss'],
  imports: [ContactSearchComponent, ButtonDirective],
})
export class ReportContactLookupComponent {
  readonly key = input('contact_1');
  readonly contactType = model.required<ContactTypes>();
  readonly contactTypeOptions = input<ContactTypes[]>();
  readonly excludeIds = input<string[]>([]);
  readonly openDialog = output<{ key: string; contactType: ContactTypes; options: PrimeOptions }>();
  readonly contactSelect = output<Contact>();

  readonly _contactTypeOptions = computed(() => {
    const contactTypes = this.contactTypeOptions() ?? [this.contactType()];
    return LabelUtils.getPrimeOptions(ContactTypeLabels, contactTypes);
  });

  open() {
    this.openDialog.emit({ key: this.key(), contactType: this.contactType(), options: this._contactTypeOptions() });
  }
}
