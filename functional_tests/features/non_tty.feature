Feature: Non-TTY (piped/non-interactive) mode

  Scenario: Printing demo runs non-interactively without ANSI escape codes
    When the executable stdout is captured for "demo:printing"
    Then the captured process should complete with exit code 0
    And the stdout should contain "Hello, World!"
    And the stdout should not contain ANSI escape codes
    And the stderr should not contain ANSI escape codes

  Scenario: Printing demo runs non-interactively with piped stdin
    When the executable stdout is captured for "demo:printing" with piped stdin
    Then the captured process should complete with exit code 0
    And the stdout should contain "Hello, World!"

  Scenario: Prompting demo fails cleanly instead of hanging when run non-interactively
    When the executable stdout is captured for "demo:prompting Alice"
    Then the captured process should complete with exit code 3
    And the stderr should contain "Execution error"
