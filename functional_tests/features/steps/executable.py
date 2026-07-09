import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from behave import when, then
from support.subprocess_wrapper import SubprocessWrapper


@when('the executable is launched')
def step_impl(context):
    context.pexpect_wrapper.start('--no-prompt')


@when('the executable is launched with "{args}"')
def step_impl(context, args):
    context.pexpect_wrapper.start('--no-prompt ' + args)


@then('the executable should complete with exit code {code:d}')
def step_impl(context, code):
    context.pexpect_wrapper.expect_eof()
    status = context.pexpect_wrapper.complete()
    assert status == code, 'unexpected exit status: {} (expected {})'.format(status, code)


@then('the executable should have output "{message}"')
def step_impl(context, message):
    context.pexpect_wrapper.expect(message)


@when('the executable stdout is captured for "{args}"')
def step_impl(context, args):
    wrapper = SubprocessWrapper(os.environ.get('EXECUTABLE'))
    wrapper.run(args)
    context.subprocess_wrapper = wrapper


@when('bash completions are requested for "{line}" at cursor {cursor:d}')
def step_impl(context, line, cursor):
    wrapper = SubprocessWrapper(os.environ.get('EXECUTABLE'))
    wrapper.run('completion:complete bash "{}" {}'.format(line, cursor))
    context.subprocess_wrapper = wrapper


@then('the captured process should complete with exit code {code:d}')
def step_impl(context, code):
    status = context.subprocess_wrapper.returncode
    assert status == code, 'unexpected exit status: {} (expected {})'.format(status, code)


@then('the stdout should contain "{text}"')
def step_impl(context, text):
    text = text.replace('\\n', '\n')
    assert text in context.subprocess_wrapper.stdout, \
        'expected {!r} in stdout {!r}'.format(text, context.subprocess_wrapper.stdout)


@then('the stdout should not contain "{text}"')
def step_impl(context, text):
    text = text.replace('\\n', '\n')
    assert text not in context.subprocess_wrapper.stdout, \
        'expected {!r} not in stdout {!r}'.format(text, context.subprocess_wrapper.stdout)


@then('the stderr should contain "{text}"')
def step_impl(context, text):
    text = text.replace('\\n', '\n')
    assert text in context.subprocess_wrapper.stderr, \
        'expected {!r} in stderr {!r}'.format(text, context.subprocess_wrapper.stderr)


@then('the stdout should be empty')
def step_impl(context):
    assert context.subprocess_wrapper.stdout.strip() == '', \
        'expected empty stdout but got {!r}'.format(context.subprocess_wrapper.stdout)


@then('the installed plugin dependencies should not include "{packages}"')
def step_impl(context, packages):
    plugins_node_modules = os.path.expanduser('~/.example-cli/plugins/node_modules')
    found = []
    for package in packages.split(','):
        package = package.strip()
        for root, dirs, _ in os.walk(plugins_node_modules):
            if package in dirs:
                found.append(os.path.join(root, package))
    assert not found, \
        'expected none of the heavy framework dependencies to be installed alongside ' \
        'the plugin, but found: {!r}'.format(found)
