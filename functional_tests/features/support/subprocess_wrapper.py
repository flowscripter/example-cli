import shlex
import subprocess
import logging

log = logging.getLogger("subprocess_wrapper")


class SubprocessWrapper:

    def __init__(self, executable):
        self.executable = executable
        self.stdout = None
        self.stderr = None
        self.returncode = None

    def run(self, args='', stdin_text=None, timeout=30):
        cmd = [self.executable] + (shlex.split(args) if args else [])
        # TEMPORARY: plain print() (not logging.debug) so this shows up in CI output regardless
        # of behave's default log-capture level, while diagnosing a Windows-only hang in
        # `plugin:add`. Remove once root-caused.
        print('DEBUG: running: {}'.format(cmd), flush=True)
        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=timeout, input=stdin_text,
                encoding='utf-8', errors='replace'
            )
        except subprocess.TimeoutExpired as e:
            print('DEBUG: TIMED OUT after {}s'.format(timeout), flush=True)
            print('DEBUG: partial stdout: {!r}'.format(e.stdout), flush=True)
            print('DEBUG: partial stderr: {!r}'.format(e.stderr), flush=True)
            raise
        self.stdout = result.stdout
        self.stderr = result.stderr
        self.returncode = result.returncode
        print('DEBUG: stdout: {!r}'.format(self.stdout), flush=True)
        print('DEBUG: stderr: {!r}'.format(self.stderr), flush=True)
        print('DEBUG: returncode: {}'.format(self.returncode), flush=True)
