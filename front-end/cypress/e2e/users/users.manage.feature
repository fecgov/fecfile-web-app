Feature: Manage Users, Core Happy Paths

  Background:
    Given I am logged in as an "owner"
    And I am on the Users page

  @smoke
  Scenario: Navigate to Users and see the table skeleton
    Then I should be on the Users route
    And I should see the users table with columns:
      | Name   |
      | Email  |
      | Role   |
      | Status |
      | Action |
    And I should see at least one user row

  @core
  Scenario Outline: Add a new user (happy path)
    When I open the Add User dialog
    And I submit email "<email>"
    Then I should see a success indicator or the user "<email>" appears in the list

    Examples:
      | email                         |
      | new.user@example.com |

  @core
  Scenario Outline: Delete a non-owner user
    Given the user "<emailToDelete>" exists in the table
    When I delete the user "<emailToDelete>"
    Then the user "<emailToDelete>" should not appear in the list

    Examples:
      | emailToDelete                 |
      | new.user@example.com        |
Feature: Manage Users Core Happy Paths

  Background:
    Given I am logged in as an "owner"
    And I am on the Users page

  @smoke
  Scenario: Navigate to Users and see the table skeleton
    Then I should be on the Users route
    And I should see the users table with columns:
      | Name   |
      | Email  |
      | Role   |
      | Status |
      | Action |
    And I should see at least one user row

  @core
  Scenario Outline: Add a new user (happy path)
    When I open the Add User dialog
    And I submit email "<email>"
    Then I should see a success indicator or the user "<email>" appears in the list

    Examples:
      | email                         |
      | new.user@example.com |

  @core
  Scenario Outline: Delete a non-owner user
    Given the user "<emailToDelete>" exists in the table
    When I delete the user "<emailToDelete>"
    Then the user "<emailToDelete>" should not appear in the list

    Examples:
      | emailToDelete                 |
      | new.user@example.com        |
