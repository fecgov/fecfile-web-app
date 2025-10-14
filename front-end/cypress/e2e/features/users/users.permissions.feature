@users @permissions
Feature: Users Permissions via Committee Switch RBAC
  The current account is admin in the default committee C99999999, but manager in C99999998.

  Background:
    Given I am logged in as an "owner"
    And I am on the Users page

  @rbac @menu
  Scenario: Manager in C99999998 can view users but cannot manage them
    Given I switch to the manager committee "C99999998"
    And I am on the Users page
    Then I should see the users table with columns:
      | Name | Email | Role | Status |
    And I should see at least one user row
    And I should not see an Add user affordance
    And I should not see any row action kebabs
    And I should see users but no management actions

  @rbac @direct
  Scenario: Directly landing on Users for C99999998 still hides management actions
    Given I am on the Users page for the manager committee "C99999998"
    Then I should not see an Add user affordance
    And I should not see any row action kebabs
    And I should see users but no management actions

  @rbac @owner
  Scenario: Owner row has no action kebab (cannot be deleted)
    Given a user row exists for "test@test.com"
    Then the row for "test@test.com" should have no action kebab

  @rbac @protected
  Scenario: Protected user row has no action kebab (cannot be deleted)
    Given a user row exists for "admin@admin.com"
    Then the row for "admin@admin.com" should have no action kebab