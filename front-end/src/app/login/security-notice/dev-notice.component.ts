import { Component } from '@angular/core';

@Component({
  template: `<h1>Security notification</h1>
    <hr type="solid" class="top-line" />
    <h2>Warning</h2>
    <p>
      This version of the application is for testing new features and functionality and gathering user feedback. Any
      submitted reports do not constitute official filings with the Federal Election Commission (FEC). Any information
      you enter at this time is subject to deletion and will not be retained.
    </p>
    <h2>Disclaimer</h2>
    <p>
      If you need to file a statement or report to meet your disclosure requirements, please use your normal method of
      submitting that information to the FEC. Submitting a report or statement through this system during the testing
      phase of this software release does not constitute an official filing with the Federal Election Commission.
    </p>
    <p>While using this system please do not:</p>
    <ul>
      <p>
        <li>prevent other users from accessing FECfile+;</li>
        <li>overload FECfile+;</li>
        <li>share committee or user accounts;</li>
        <li>
          attempt to gain unauthorized access to FECfile+ or related systems or networks or to defeat, avoid, bypass,
          remove, deactivate, or otherwise circumvent any software protection or monitoring mechanisms of FECfile+;
        </li>
        <li>create committee or user accounts in bulk.</li>
      </p>
    </ul>
    <h2>Legal disclosure</h2>
    <p>
      This is a U.S. Federal Government system that is for official use only. Unauthorized use is strictly prohibited.
    </p>`,
  styleUrls: ['./security-notice.component.scss'],
})
export class DevNoticeComponent {}
