Feature: Executable

  Scenario: Executable success
    When the executable is launched
    Then the executable should complete with exit code 2
    And the executable should have output "No command specified"
