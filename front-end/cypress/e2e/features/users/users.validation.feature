Feature: Users – Invite/Delete validation and failure states
  Goal: Validate client-side email errors and server-side failure states for invite and delete.
        Ensure UI remains usable and status is clear.

  Background:
    Given I am logged in as an "owner"
    And I am on the Users page

  @client @email
  Scenario: Invalid email shows client validation and prevents submit
    When I open the Add User dialog
    And I fill the invite email :       
      | invalid-email    |
      | missing-at.com   |
      | @missing-user.com|
      | missing-dot@com  |
      | missing-domain@. |
      | space @test.com  |
    Then the inline email error should equal "This email is invalid"
    When the email field is empty 
    And I submit the invite
    Then the inline email error should equal "This is a required field."
    And no invite request should be sent

  @server @email @409
  Scenario: Duplicate invite (409) shows accessible error text
    Given I stub the next invite as 409 duplicate with message "User already invited"
    When I open the Add User dialog
    And I fill the invite email "test@test.com"
    And I submit the invite
    Then an accessible error should be announced
    And the inline email error should equal "This user email already exists in this committee account."
    And the Invite submit remains enabled for retry

  @server @email @500
  Scenario: Add (invite) 500 shows retry-safe, non-blocking error state
    Given I stub the next invite as 500
    When I open the Add User dialog
    And I fill the invite email "dummy@dummy.com"
    And I submit the invite
    And I can retry inviting the same email successfully
    And I will watch the members list refresh

  @server @delete @500
  Scenario: Delete 500 shows retry-safe, non-blocking error state and row remains until success
    Given a user row exists for "dummy@dummy.com"
    And I stub the next delete as 500 for "dummy@dummy.com"
    When I attempt to delete "dummy@dummy.com"
    And I can retry delete for "dummy@dummy.com" successfully
    Then a SUCCESS ptoast should be visible and is closed
