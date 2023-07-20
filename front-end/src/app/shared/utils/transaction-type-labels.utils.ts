export class LabelConfig {
  description?: string; // Prose describing transaction and filling out the form
  accordionTitle?: string; // Title for accordion handle (does not include subtext)
  accordionSubText?: string; // Text after title in accordion handle
  formTitle?: string; // Title of form within accordion section
  footer?: string; // Text at the end of form
  contact?: string; // Title for primary contact
  contactLookupLabel?: string; //Label above contact lookup

  constructor(
    description?: string,
    accordionTitle?: string,
    accordionSubText?: string,
    formTitle?: string,
    footer?: string,
    contact?: string,
    contactLookupLabel?: string
  ) {
    this.description = description;
    this.accordionTitle = accordionTitle;
    this.accordionSubText = accordionSubText;
    this.formTitle = formTitle;
    this.footer = footer;
    this.contact = contact;
    this.contactLookupLabel = contactLookupLabel;
  }
}

// IN KIND
export const IN_KIND = new LabelConfig(
  'This receipt type automatically creates an associated transaction. Saving an in-kind receipt will automatically create an in-kind out.',
  'ENTER DATA',
  'Add contact and receipt information',
  undefined,
  'The information in this receipt will automatically populate a related transaction. Review the associated disbursement or click "Save both transactions" to record these transactions.',
  'Contact',
  'CONTACT LOOKUP'
);

export const IN_KIND_OUT = new LabelConfig(
  'To update any errors found, return to the previous step to update the in-kind receipt.',
  'AUTO-POPULATED',
  'Review disbursement information',
  undefined,
  undefined,
  'Contact',
  'CONTACT LOOKUP'
);

// EARMARK
export const EARMARK = new LabelConfig(
  'This type of receipt requires a memo transaction. Follow this two-step process to create both an earmark receipt and an earmark memo:',
  'STEP ONE',
  'Add receipt and contributor information',
  undefined,
  undefined,
  'Contact',
  'CONTACT LOOKUP'
);

export const EARMARK_MEMO = new LabelConfig(
  undefined,
  'STEP TWO',
  'Add earmarked memo and conduit information (REQUIRED FOR EARMARKED RECEIPTS)',
  undefined,
  undefined,
  'Conduit',
  'CONTACT LOOKUP'
);

// CONDUIT EARMARK
export const CONDUIT_EARMARK = new LabelConfig(
  'This receipt type requires an associated transaction. Follow this two-step process to create both a conduit earmark receipt and a conduit earmark out:',
  'STEP ONE',
  'Add contact and receipt information',
  undefined,
  undefined,
  'Contact',
  'CONTACT LOOKUP'
);

export const CONDUIT_EARMARK_OUT = new LabelConfig(
  undefined,
  'STEP TWO',
  'Add earmarked memo and conduit information (REQUIRED FOR CONDUIT EARMARKED RECEIPTS)',
  undefined,
  undefined,
  'Contact',
  'CONTACT LOOKUP'
);

//LOAN
export const LOAN = new LabelConfig(
  'Saving a loan received from individual will automatically create a related receipt.',
  'ENTER DATA',
  'Enter lender, loan, and terms information for a loan received from individual',
  undefined,
  'The information in this loan will automatically create a related receipt. Review the receipt; enter a purpose of receipt or note/memo text; or continue without reviewing and “Save transactions.”',
  'Lender',
  'LENDER LOOKUP'
);

export const LOAN_RECEIPT = new LabelConfig(
  'Only the Purpose of Receipt and Note/Memo Text are editable. To update any errors found, return to the previous step to update loan information.',
  'AUTO-POPULATED',
  'Review information and enter purpose of description or note/memo text',
  'Reciept',
  undefined,
  'Contact',
  'CONTACT LOOKUP'
);

//AA
// export const AA_A__LABEL_CONFIG = new LabelConfig(
//   'This receipt type automatically creates an associated transaction. Saving an in-kind receipt will automatically create an in-kind out.',
//   'ENTER DATA',
//   'Add contact and receipt information'
// );
// export const AA__A_LABEL_CONFIG = new LabelConfig(undefined, 'AUTO-POPULATED', 'Review disbursement information');

//AG
// export const AG_A_LABEL_CONFIG = new LabelConfig(
//   'This type of receipt requires a memo transaction. Follow this two-step process to create both an earmark receipt and an earmark memo:',
//   'STEP ONE',
//   'Add receipt and contributor information'
// );

// export const AG_G_LABEL_CONFIG = new LabelConfig(
//   undefined,
//   'STEP TWO',
//   'Add earmarked memo and conduit information (REQUIRED FOR EARMARKED RECEIPTS)'
// );

// //EE
// // export const EE_E__LABEL_CONFIG = new LabelConfig(
// //   'This receipt type automatically creates an associated transaction. Saving an in-kind receipt will automatically create an in-kind out.',
// //   'ENTER DATA',
// //   'Add contact and receipt information'
// // );
// // export const EE__E_LABEL_CONFIG = new LabelConfig(undefined, 'AUTO-POPULATED', 'Review disbursement information');

// //FG
// export const FG_F_LABEL_CONFIG = new LabelConfig(
//   'This type of receipt requires a memo transaction. Follow this two-step process to create both an earmark receipt and an earmark memo:',
//   'STEP ONE',
//   'Add receipt and contributor information'
// );

// export const FG_G_LABEL_CONFIG = new LabelConfig(
//   undefined,
//   'STEP TWO',
//   'Add earmarked memo and conduit information (REQUIRED FOR EARMARKED RECEIPTS)'
// );
// //NM
// export const NM_N_LABEL_CONFIG = new LabelConfig(
//   'This receipt type requires an associated transaction. Follow this two-step process to create both a conduit earmark receipt and a conduit earmark out:',
//   'STEP ONE',
//   'Add contact and receipt information'
// );

// export const NM_M_LABEL_CONFIG = new LabelConfig(
//   undefined,
//   'STEP TWO',
//   'Add earmarked memo and conduit information (REQUIRED FOR CONDUIT EARMARKED RECEIPTS)'
// );

// //PM
// export const PM_P_LABEL_CONFIG = new LabelConfig(
//   'This receipt type requires an associated transaction. Follow this two-step process to create both a conduit earmark receipt and a conduit earmark out:',
//   'STEP ONE',
//   'Add contact and receipt information'
// );

// export const PM_M_LABEL_CONFIG = new LabelConfig(
//   undefined,
//   'STEP TWO',
//   'Add earmarked memo and conduit information (REQUIRED FOR CONDUIT EARMARKED RECEIPTS)'
// );
