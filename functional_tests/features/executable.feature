Feature: Executable

  Scenario: No command specified
    When the executable is launched
    Then the executable should complete with exit code 2
    And the executable should have output "No command specified"

  Scenario: Printing demo
    When the executable is launched with "demo:printing"
    Then the executable should complete with exit code 0
    And the executable should have output "Hello, World!"
    And the executable should have output "Finished waiting"
    And the executable should have output "Background Red"
    And the executable should have output "Background Blue"
    And the executable should have output "Flowscripter on GitHub"
    And the executable should have output "--- Tree ---"
    And the executable should have output "--- Table ---"
    And the executable should have output "--- Data Dump ---"

  Scenario: Argument parsing demo
    When the executable is launched with "demo:arg-parsing true 1 hello"
    Then the executable should complete with exit code 0
    And the executable should have output "booleanPositional"
    And the executable should have output "numberPositional"
    And the executable should have output "stringPositional"

  Scenario: Banners demo
    When the executable is launched with "demo:banners"
    Then the executable should complete with exit code 0
    And the executable should have output "Chisel Font ASCII Banner Demo"
    And the executable should have output "ASCII Banner Subtitle Demo"

  Scenario: Completion demo
    When the executable is launched with "demo:completion"
    Then the executable should complete with exit code 0
    And the executable should have output "Bash bootstrap script"

  Scenario: Configuration demo
    When the executable is launched with "demo:configuration"
    Then the executable should complete with exit code 0
    And the executable should have output "Key-Value Storage"
    And the executable should have output "Secret Storage"
