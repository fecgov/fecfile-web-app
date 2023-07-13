export class LabelConfig {
  description?: string; // Prose describing transaction and filling out the form
  accordionTitle?: string; // Title for accordion handle (does not include subtext)
  accordionSubText?: string; // Text after title in accordion handle
  formTitle?: string; // Title of form within accordion section
  footer?: string; // Text at the end of form
  contact?: string; // Title for primary contact

  constructor(
    description?: string,
    accordionTitle?: string,
    accordionSubTitle?: string,
    formTitle?: string,
    footer?: string,
    contact?: string
  ) {
    this.description = description;
    this.accordionTitle = accordionTitle;
    this.accordionSubText = accordionSubTitle;
    this.formTitle = formTitle;
    this.footer = footer;
    this.contact = contact;
  }
}

// IN KIND
export const IN_KIND = new LabelConfig(
  'This receipt type automatically creates an associated transaction. Saving an in-kind receipt will automatically create an in-kind out.',
  'ENTER DATA',
  'Add contact and receipt information',
  undefined,
  'The information in this receipt will automatically populate a related transaction. Review the associated disbursement or click "Save both transactions" to record these transactions.'
);

export const IN_KIND_OUT = new LabelConfig(
  'To update any errors found, return to the previous step to update the in-kind receipt.',
  'AUTO-POPULATED',
  'Review disbursement information',
  undefined,
  undefined,
  'Contact'
);

// EARMARK
export const EARMARK = new LabelConfig(
  'This type of receipt requires a memo transaction. Follow this two-step process to create both an earmark receipt and an earmark memo:',
  'STEP ONE',
  'Add receipt and contributor information'
);

export const EARMARK_MEMO = new LabelConfig(
  undefined,
  'STEP TWO',
  'Add earmarked memo and conduit information (REQUIRED FOR EARMARKED RECEIPTS)',
  undefined,
  undefined,
  'Conduit'
);

// CONDUIT EARMARK
export const CONDUIT_EARMARK = new LabelConfig(
  'This receipt type requires an associated transaction. Follow this two-step process to create both a conduit earmark receipt and a conduit earmark out:',
  'STEP ONE',
  'Add contact and receipt information'
);

export const CONDUIT_EARMARK_OUT = new LabelConfig(
  undefined,
  'STEP TWO',
  'Add earmarked memo and conduit information (REQUIRED FOR CONDUIT EARMARKED RECEIPTS)',
  undefined,
  undefined,
  'Contact'
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
