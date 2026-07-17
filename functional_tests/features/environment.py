import os
import platform

from support.pexpect_wrapper import PExpectWrapper

IS_WINDOWS = platform.system() == 'Windows'


def before_scenario(context, scenario):

    if IS_WINDOWS and 'requires_tty' in scenario.effective_tags:
        scenario.skip('pexpect on Windows uses PopenSpawn (pipes), which cannot provide '
                       'the real TTY this scenario depends on')
        return

    context.config.setup_logging()
    context.pexpect_wrapper = PExpectWrapper(os.environ.get('EXECUTABLE'))
