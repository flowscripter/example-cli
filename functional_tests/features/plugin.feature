Feature: Plugin management

  Note: These scenarios require @flowscripter/example-cli-plugin to be
  published on npmjs.com and the test machine to have network access.
  The plugin install folder is ~/.examplecli/plugins.

  Scenario: Search for example-cli-plugin on npmjs
    When the executable is launched with "plugin:search example-cli-plugin"
    Then the executable should complete with exit code 0
    And the executable should have output "example-cli-plugin"

  Scenario: List plugins when none installed
    When the executable is launched with "plugin:list"
    Then the executable should complete with exit code 0

  Scenario: Attempt to add a plugin that does not exist in the registry
    When the executable stdout is captured for "--no-prompt plugin:add @flowscripter/example-cli-plugin-does-not-exist-xyz" with timeout 60s
    Then the captured process should complete with exit code 3
    And the stderr should contain "Plugin @flowscripter/example-cli-plugin-does-not-exist-xyz was not found in the configured plugin registry"

  Scenario: Attempt to add a non-existent version of an existing plugin
    When the executable stdout is captured for "--no-prompt plugin:add @flowscripter/example-cli-plugin@0.0.0-does-not-exist" with timeout 60s
    Then the captured process should complete with exit code 3
    And the stderr should contain "Version 0.0.0-does-not-exist of plugin @flowscripter/example-cli-plugin was not found in the configured plugin registry"

  Scenario: Install example-cli-plugin
    # dynamic-cli-framework 5.4.0+ shows "Searching for plugin: ..."/"Installing ..." via a
    # spinner (PrinterService.showSpinner()), which is a documented no-op when stderr is not a
    # TTY - so this non-interactive capture won't see that text in stderr. Only the final result
    # message (printed via print(), not the spinner) is checked here.
    When the executable stdout is captured for "--no-prompt plugin:add @flowscripter/example-cli-plugin" with timeout 60s
    Then the captured process should complete with exit code 0
    And the stdout should contain "installed"

  Scenario: Installing example-cli-plugin does not pull in the full dynamic-cli-framework
    Then the installed plugin dependencies should not include "figlet, emphasize, highlight.js, prettier, supports-color, supports-terminal-graphics"

  Scenario: List installed plugins after install
    When the executable is launched with "plugin:list"
    Then the executable should complete with exit code 0
    And the executable should have output "example-cli-plugin"

  Scenario: Plugin dependencies are installed
    Then the plugin node_modules directory should contain "cowsay"
    And the plugin node_modules directory should contain "@flowscripter/dynamic-cli-framework-api"

  Scenario: Use hello command from installed plugin
    When the executable is launched with "hello"
    Then the executable should complete with exit code 0
    And the executable should have output "Hello"

  Scenario: Use hello_rust command from installed plugin
    When the executable is launched with "hello_rust"
    Then the executable should complete with exit code 0
    And the executable should have output "World 4"

  Scenario: Remove example-cli-plugin
    When the executable is launched with "plugin:remove @flowscripter/example-cli-plugin"
    Then the executable should complete with exit code 0

  Scenario: Plugin no longer listed after removal
    When the executable is launched with "plugin:list"
    Then the executable should complete with exit code 0

  Scenario: No orphaned transitive dependencies remain after removal
    Then the plugin node_modules directory should not contain "@flowscripter/example-cli-plugin"
    And the plugin node_modules directory should not contain "cowsay"
    And the plugin node_modules directory should not contain "@flowscripter/template-bun-rust-library"
    And the plugin node_modules directory should not contain "@flowscripter/dynamic-cli-framework"
