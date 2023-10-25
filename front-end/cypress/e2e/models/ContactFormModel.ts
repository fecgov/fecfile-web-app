import { PageUtils } from "../pages/pageUtils";

export class ContactFormData {
    contact_type: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    prefix: string;
    suffix: string;
    country: string;
    street_1: string;
    street_2: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    employer: string;
    occupation: string;
    candidate_id: string;
    candidate_office: string;
    candidate_state: string;
    candidate_district: string;
    committee_id: string;
    name: string;

    constructor(formData: ContactFormData) {
        this.contact_type = formData.contact_type;
        this.last_name = formData.last_name;
        this.first_name = formData.first_name;
        this.middle_name = formData.middle_name;
        this.prefix = formData.prefix;
        this.suffix = formData.suffix;
        this.country = formData.country;
        this.street_1 = formData.street_1;
        this.street_2 = formData.street_2;
        this.city = formData.city;
        this.state = formData.state;
        this.zip = formData.zip;
        this.phone = formData.phone;
        this.employer = formData.employer;
        this.occupation = formData.occupation;
        this.name = formData.name;
        this.committee_id = formData.committee_id;
        this.candidate_district = formData.candidate_district;
        this.candidate_id = formData.candidate_id;
        this.candidate_office = formData.candidate_office;
        this.candidate_state = formData.candidate_state;
    }
  };

  export const defaultFormData: ContactFormData = {
    contact_type: 'Individual',
    last_name: PageUtils.randomString(10),
    first_name: PageUtils.randomString(10),
    middle_name: PageUtils.randomString(10),
    prefix: PageUtils.randomString(5),
    suffix: PageUtils.randomString(5),
    country: 'United States of America',
    street_1: PageUtils.randomString(10),
    street_2: PageUtils.randomString(10),
    city: PageUtils.randomString(10),
    state: 'District of Columbia',
    zip: PageUtils.randomString(5),
    phone: PageUtils.randomString(10, 'numeric'),
    employer: PageUtils.randomString(20),
    occupation: PageUtils.randomString(20),
    candidate_id: 'H2AZ12345',
    candidate_office: 'House',
    candidate_state: 'Virginia',
    candidate_district: '01',
    committee_id: 'C' + PageUtils.randomString(8, 'numeric'),
    name: PageUtils.randomString(10),
  };

