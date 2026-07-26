import os
import platform
import sys

from support.pexpect_wrapper import PExpectWrapper

IS_WINDOWS = platform.system() == 'Windows'

if IS_WINDOWS:
    # Windows' legacy console codepage (e.g. cp1252) cannot encode several Unicode icons used
    # in example-cli's coloured output (e.g. the U+203C alert icon), crashing behave's pretty
    # formatter with UnicodeEncodeError whenever a failure message contains one. Reconfigure
    # the streams to UTF-8, which covers them, before any output is written.
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')


def before_scenario(context, scenario):

    if IS_WINDOWS and 'requires_tty' in scenario.effective_tags:
        scenario.skip('pexpect on Windows uses PopenSpawn (pipes), which cannot provide '
                       'the real TTY this scenario depends on')
        return

    context.config.setup_logging()
    context.pexpect_wrapper = PExpectWrapper(os.environ.get('EXECUTABLE'))
