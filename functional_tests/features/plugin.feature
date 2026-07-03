Feature: Plugin management

  Note: These scenarios require @flowscripter/example-cli-plugin to be
  published on npmjs.com and the test machine to have network access.
  The plugin install folder is ~/.example-cli/plugins.

  Scenario: Search for example-cli-plugin on npmjs
    When the executable is launched with "plugin:search example-cli-plugin"
    Then the executable should complete with exit code 0
    And the executable should have output "example-cli-plugin"

  Scenario: List plugins when none installed
    When the executable is launched with "plugin:list"
    Then the executable should complete with exit code 0

  Scenario: Install example-cli-plugin
    When the executable is launched with "plugin:add @flowscripter/example-cli-plugin"
    Then the executable should complete with exit code 0
    And the executable should have output "installed"

  Scenario: List installed plugins after install
    When the executable is launched with "plugin:list"
    Then the executable should complete with exit code 0
    And the executable should have output "example-cli-plugin"

  Scenario: Use hello command from installed plugin
    When the executable is launched with "hello"
    Then the executable should complete with exit code 0
    And the executable should have output "Hello"

  Scenario: Remove example-cli-plugin
    When the executable is launched with "plugin:remove @flowscripter/example-cli-plugin"
    Then the executable should complete with exit code 0

  Scenario: Plugin no longer listed after removal
    When the executable is launched with "plugin:list"
    Then the executable should complete with exit code 0
