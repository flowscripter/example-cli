Feature: Executable

  Scenario: No command specified
    When the executable is launched
    Then the executable should complete with exit code 2
    And the executable should have output "No command specified"

  Scenario: Command1 printer demo
    When the executable is launched with "command1"
    Then the executable should complete with exit code 0
    And the executable should have output "Hello, World!"
    And the executable should have output "Finished waiting"

  Scenario: Command2 argument features
    When the executable is launched with "command2 true 1 hello"
    Then the executable should complete with exit code 0
    And the executable should have output "booleanPositional"
    And the executable should have output "numberPositional"
    And the executable should have output "stringPositional"

  Scenario: Command3 printer features
    When the executable is launched with "command3"
    Then the executable should complete with exit code 0
    And the executable should have output "Background Red"
    And the executable should have output "Background Blue"
    And the executable should have output "Flowscripter on GitHub"

  Scenario: Command5 tree table datadump
    When the executable is launched with "command5"
    Then the executable should complete with exit code 0
    And the executable should have output "Tree Demo"
    And the executable should have output "Table Demo"
    And the executable should have output "Data Dump Demo"

  Scenario: Command6 secrets completion chisel banner
    When the executable is launched with "command6"
    Then the executable should complete with exit code 0
    And the executable should have output "Secrets Demo"
    And the executable should have output "Completion Demo"
    And the executable should have output "Chisel Font ASCII Banner Demo"
    And the executable should have output "ASCII Banner Subtitle Demo"
