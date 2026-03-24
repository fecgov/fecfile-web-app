import { Component } from '@angular/core';

@Component({
  selector: 'app-prod-notice',
  template: `
    <h2 class="mt-0">Overview</h2>
    <p>
      The Federal Election Commission (FEC) offers electronic filing software, FECfile+. The FEC provides this service
      to comply with the software requirements of the Federal Election Campaign Act (FECA) 52 U.S.C. §30104(a)(12)(A).
      The service is offered subject to acceptance of FECfile+'s terms of service, FECfile+'s acceptable use policy, as
      well as any relevant sections of FEC's sale or use restriction and FEC's privacy and security policy
      (collectively, the "Agreement").
    </p>
    <p>
      Please read the Agreement carefully before you start to use FECfile+. By clicking CONSENT below, you accept and
      agree to be bound and abide by this Agreement in addition to the FEC.gov Privacy and Security Policy, incorporated
      herein by reference. If you do not want to agree to this Agreement or the FEC.gov Privacy and Security Policy, you
      must not access or use the FECfile+ service, or any portion thereof.
    </p>
    <h2>Terms of service</h2>
    <h3>Scope</h3>
    <p>
      All the content, documentation, code and related materials made available to you through FECfile+, related
      services and our GitHub repositories, are subject to these terms. Access to or use of FECfile+ and related
      services constitutes acceptance of this Agreement.
    </p>
    <h3>Use</h3>
    <p>You may use FECfile+ to meet disclosure requirements.</p>
    <h3>Eligibility restrictions</h3>
    <p>
      Access to FECfile+ is restricted to a limited number of committees and other filers, and is available by
      invitation only, due to the software’s current limited functionality. Signing up for FECfile+ without an
      invitation may result in termination of access. See Service Termination.
    </p>
    <h3>Electronic filing disclaimer</h3>
    <p>
      Committees are required to file electronically if total contributions received or total expenditures made exceed,
      or are expected to exceed, $50,000 in any calendar year. Committees not required to file electronically but those
      that choose to do so must continue to file electronically for that calendar year, in accordance with 11 C.F.R.
      §104.18. By using FECfile+, you acknowledge and agree that filing a form through this platform constitutes an
      electronic filing.
    </p>
    <h3>Authentication</h3>
    <p>
      FECfile+ uses a government-wide authentication service provider, login.gov. Login.gov’s privacy and data policies
      are available on the U.S. General Services Administration's (GSA) website.
    </p>
    <h3>Data storage</h3>
    <p>
      FECfile+ stores your filing data on a government-wide cloud service provider, cloud.gov. Cloud.gov’s privacy and
      data policies are available on GSA’s website. The FEC reserves the right to change cloud service providers and if
      it does so, will update the terms of service.
    </p>
    <h3>Technical/Customer support</h3>
    <p>
      FECfile+ support hours are Monday through Friday from 9:00 a.m. to 5:30 p.m. Eastern Time, excluding federal
      holidays. The FEC’s Electronic Filing Office, or their agents, may view a your data if you provide consent for
      assistance with FECfile+. Technical support issues may take up to 48 business hours to resolve.
    </p>
    <h3>Attribution</h3>
    <p>
      All services which utilize FECfile+ code or access related services must identify the FEC as the source. You may
      not use the FEC name, logo, or the like to imply endorsement of any product, service, or entity--not-for-profit,
      commercial or otherwise.
    </p>
    <h3>Modification or false representation of content</h3>
    <p>
      You may not modify or falsely represent content accessed through FECfile+ or related services and still claim the
      source is FEC.
    </p>
    <h3>Right to limit</h3>
    <p>
      Your use of FECfile+ and related services may be subject to certain limitations on access, API calls, or use as
      set forth within this Agreement or otherwise provided by the FEC. If the FEC reasonably believes that you have
      attempted to exceed or circumvent these limits, your ability to use these services may be permanently or
      temporarily blocked. The FEC may monitor your use of these services to improve the service or to ensure compliance
      with this Agreement.
    </p>
    <h3>Service termination</h3>
    <p>
      If you wish to terminate this Agreement, you may do so by refraining from further use of FECfile+ and related
      services. In the event you violate of any of the terms of this Agreement, or when otherwise deemed reasonably
      necessary by the FEC, the FEC reserves the right, at its sole discretion, to terminate or deny access to and use
      of all or part of FECfile+ and related services. The terms of this Agreement shall survive termination.
    </p>
    <p>
      The FEC also reserves the right to eliminate FECfile+ and its related services. In the event that the FEC no
      longer provides FECfile+ and its services, other software will be available for committees and other filers to use
      to comply with their disclosure requirements.
    </p>
    <h3>Disclaimer of warranties</h3>
    <p>
      FECfile+ and related services are provided "as is" and on an "as-available" basis. The FEC makes no warranty that
      FECfile+ or related services will be error free or that access thereto will be continuous or uninterrupted.
    </p>
    <p>
      You understand that we cannot and do not guarantee or warrant that files available for downloading from FECfile+
      or FEC.gov will be free of viruses or other destructive code. You are responsible for implementing sufficient
      procedures and checkpoints to satisfy your particular requirements for anti-virus protection and accuracy of data
      input and output, and for maintaining a means external to our site for any reconstruction of any lost data. To the
      fullest extent provided by law, the FEC will not be liable for any loss or damage caused by a distributed
      denial-of-service attack, viruses, or other technologically harmful material that may infect your computer
      equipment, computer programs, data, or other proprietary material due to your use of FECfile+ or any services or
      items obtained through fec.gov or your downloading of any material posted on it, or on any website linked to it.
    </p>
    <p>
      Your use of the website, its content, and any services or items obtained through the website is at your own risk.
      the website, its content, and any services or items obtained through the website are provided on an "as is" and
      "as available" basis, without any warranties of any kind, either express or implied. Neither the FEC nor any
      person associated with the FEC makes any warranty or representation with respect to the completeness, security,
      reliability, quality, accuracy, or availability of FECfile+. without limiting the foregoing, neither the fec nor
      anyone associated with the FEC represents or warrants that FECfile+, its content, or any services or items
      obtained through FECfile+ will be accurate, reliable, error-free, or uninterrupted, that defects will be
      corrected, that our site or the server that makes it available are free of viruses or other harmful components, or
      that the website or any services or items obtained through the website will otherwise meet your needs or
      expectations.
    </p>
    <p>
      To the fullest extent provided by law, the FEC hereby disclaims all warranties of any kind, whether express or
      implied, statutory, or otherwise, including but not limited to any warranties of merchantability,
      non-infringement, and fitness for particular purpose.
    </p>
    <p>The foregoing does not affect any warranties that cannot be excluded or limited under applicable law.</p>
    <h3>Limitations on liability and Indemnification</h3>
    <p>
      In no event will the FEC be liable with respect to any subject matter of this Agreement. Further, the you agree to
      indemnify and hold the FEC harmless against all claims arising from use of FECfile+ or the API.
    </p>
    <h3>General representations</h3>
    <p>
      You hereby warrant that (1) your use of FECfile+ and related services will be in strict accordance with the FEC
      privacy policy, this Agreement, and all applicable laws and regulations, and (2) your use of FECfile+ and related
      services will not infringe or misappropriate the intellectual property rights of any third party.
    </p>
    <h3>Changes</h3>
    <p>
      The FEC reserves the right, at its sole discretion, to modify or replace this Agreement, in whole or in part. Your
      continued use of or access to FECfile+ and related services following posting of any changes to this Agreement
      constitutes acceptance of those modified terms. The FEC may, in the future, offer new services and/or features
      through FECfile+ and related services. Such new features and/or services shall be subject to the terms and
      conditions of this Agreement.
    </p>
    <h3>Disputes</h3>
    <p>
      Any disputes arising out of this Agreement and access to or use of FECfile+ or related services shall be governed
      by federal law.
    </p>
    <h3>No waiver of rights</h3>
    <p>
      The FEC's failure to exercise or enforce any right or provision of this Agreement shall not constitute waiver of
      such right or provision.
    </p>
    <h2>3. Acceptable use policy</h2>
    <p>
      This acceptable use policy sets out a list of acceptable and unacceptable conduct for using FECfile+ and related
      services in addition to the restrictions imposed by the terms of service. If we believe a violation of the policy
      is deliberate, repeated or presents a credible risk of harm to other users, the services or any third parties, we
      may suspend or terminate your access. If there is any inconsistency between this acceptable use policy and the
      terms of service, the terms of service will take priority to the extent of the inconsistency.
    </p>
    <h3>Changes to this acceptable use policy</h3>
    <p>The FEC may update this acceptable use policy at any time. Updates will be made available within FECfile+.</p>
    <h3>Acceptable and unacceptable conduct</h3>
    <h3>Do:</h3>
    <ul>
      <li>comply with terms of service, including the terms of this acceptable use policy;</li>
      <li>comply with all applicable laws and governmental regulations;</li>
      <li>keep all login information confidential;</li>
      <li>
        monitor and control all activity conducted through your accounts in connection with FECfile+ and related
        services; and
      </li>
      <li>
        promptly notify us if you become aware of or reasonably suspect any illegal or unauthorized activity involving
        your accounts.
      </li>
    </ul>
    <h3>Don't:</h3>
    <ul>
      <li>prevent other users from accessing FECfile+ or related services;</li>
      <li>knowingly and willfully taking any actions that overloads FECfile+ or related services;</li>
      <li>materially reduce the speed of FECfile+ or related services for other users;</li>
      <li>share, transfer or otherwise provide access to accounts designated for you to another person;</li>
      <li>
        attempt to gain unauthorized access to FECfile+ or related systems or networks or to defeat, avoid, bypass,
        remove, deactivate, or otherwise circumvent any software protection or monitoring mechanisms of FECfile+ or
        related services;
      </li>
      <li>engage in activity that incites or encourages violence or hatred against individuals or groups;</li>
      <li>impersonate any person or entity;</li>
      <li>create false or fictitious filings and/or accounts</li>
      <li>create accounts in bulk;</li>
      <li>send unsolicited communications, promotions or advertisements, or spam;</li>
      <li>send altered, deceptive or false source-identifying information, including "spoofing" or "phishing"; or</li>
      <li>authorize, permit, enable, induce or encourage any third party to do any of the above.</li>
    </ul>
    <h2>4. Sale or use restriction</h2>
    <p>
      Sale or use of publicly disclosed campaign finance information is restricted. 52 U.S.C. §30111(a)(4) and 11 C.F.R.
      §104.15
    </p>
    <h2>5. Privacy and data use</h2>
    <p>Information collected through the software is governed by the FEC’s privacy and security policy.</p>
    <p>If you use FECfile+, we collect the following information:</p>
    <ul>
      <li>Your name, address, phone number (if provided), and email address.</li>
      <li>
        Data from your campaign finance reports and statements, including but not limited to committee details, as well
        as contributor information such as name, address, employer occupation (when applicable), and telephone number
        (optional)
      </li>
      <li>Cookie information related to authentication only</li>
      <li>
        Logging and analytical data required to comply with security monitoring policies, including IP address, device
        details, browser type and version
      </li>
      <li>A user ID (uuid) provided by login.gov, our authentication provider</li>
    </ul>
    <p>
      Data submitted on campaign finance reports and statements are subject to public disclosure, 52 U.S.C.
      §30104(a)(11)(B). Reports and statements may be viewed on the FEC’s website.
    </p>
    <h2>6. Consent</h2>
    <p>
      This is a U.S. Federal Government system that is for official use only. Unauthorized use is strictly prohibited.
    </p>
    <p>
      This U.S. Federal Government system is to be used by authorized users only. All access or use of this system
      constitutes your understanding and acceptance of these terms and constitutes unconditional consent to review,
      monitoring and action by all authorized government and law enforcement personnel. While using this system your use
      may be monitored, recorded and subject to audit.
    </p>
    <p>
      Unauthorized attempts to access, upload, change, delete, or deface information on this system; modify this system;
      deny access to this system; accrue resources for unauthorized use; or otherwise misuse this system are strictly
      prohibited and may result in criminal, civil, or administrative penalties.
    </p>
    <p>
      Furthermore, knowingly and willfully making any materially false, fictitious, or fraudulent statement or
      representation to a federal government agency, including the Federal Election Commission, is punishable under 18
      U.S.C. §1001. The Commission may report apparent violations to the appropriate law enforcement authorities, as per
      52 U.S.C. §30107(a)(9).
    </p>
    <p>
      This Agreement constitutes the entire Agreement between the FEC and you concerning the subject matter hereof, and
      may only be modified by the posting of a revised version on this page by the FEC.
    </p>
  `,
  styleUrls: ['./security-notice.component.scss'],
})
export class ProdNoticeComponent {}
