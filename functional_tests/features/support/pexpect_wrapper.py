import logging
import platform
import pexpect

log = logging.getLogger("pexpect_wrapper")

IS_WINDOWS = platform.system() == 'Windows'

if IS_WINDOWS:
    from pexpect.popen_spawn import PopenSpawn


class PExpectWrapper:

    def __init__(self, executable):
        self.executable = executable
        self.child = None
        self.output = None

    def start(self, args=''):
        assert self.child is None

        cmd = self.executable
        if args:
            cmd = cmd + ' ' + args
        if IS_WINDOWS:
            self.child = PopenSpawn(cmd, encoding='utf-8', timeout=30)
        else:
            self.child = pexpect.spawn(cmd, encoding='utf-8', timeout=30)

    def expect(self, message):
        assert self.child is not None

        found = ''
        while len(self.output) > 0:
            next_line = self.output.pop(0)
            log.debug('looking for "{}" in "{}"'.format(message, next_line))
            if message in next_line:
                found = next_line
                break

        assert found != '', 'expected {} in output'.format(message)

    def expect_eof(self):
        assert self.child is not None

        self.child.expect(pexpect.EOF)

    def complete(self):
        assert self.child is not None

        if IS_WINDOWS:
            self.child.wait()
            exit_status = self.child.exitstatus
            if exit_status is None:
                exit_status = -1
        else:
            self.child.close()
            exit_status = self.child.exitstatus
            if exit_status is None:
                exit_status = self.child.signalstatus or -1

        self.output = self.child.before.split('\n') if self.child.before else []

        return exit_status
