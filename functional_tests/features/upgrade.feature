Feature: Upgrade

  Scenario: Running upgrade either upgrades or reports already up to date
    When the executable is launched with "upgrade"
    Then the executable should complete with exit code 0
    And the executable should have either output "example-cli upgraded" or "example-cli is already up to date"
