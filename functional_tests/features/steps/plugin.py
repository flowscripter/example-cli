import os

from behave import then

PLUGINS_NODE_MODULES = os.path.expanduser(
    os.path.join('~', '.example-cli', 'plugins', 'node_modules')
)


@then('the plugin node_modules directory should contain "{name}"')
def step_impl(context, name):
    path = os.path.join(PLUGINS_NODE_MODULES, name)
    assert os.path.exists(path), \
        'expected {!r} to exist under {!r}'.format(name, PLUGINS_NODE_MODULES)


@then('the plugin node_modules directory should not contain "{name}"')
def step_impl(context, name):
    path = os.path.join(PLUGINS_NODE_MODULES, name)
    assert not os.path.exists(path), \
        'expected {!r} not to exist under {!r}'.format(name, PLUGINS_NODE_MODULES)
