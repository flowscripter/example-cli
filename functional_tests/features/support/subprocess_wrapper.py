import platform
import shlex
import subprocess
import logging

log = logging.getLogger("subprocess_wrapper")


def _dump_process_tree():
    # TEMPORARY: diagnosing an intermittent Windows-only hang in `plugin:add`. Dumps the OS
    # process list on timeout so we can see whether a child npm/node process is stuck vs. our
    # own process. Remove once root-caused.
    try:
        if platform.system() == 'Windows':
            out = subprocess.run(
                ['tasklist', '/v'], capture_output=True, text=True, timeout=10
            ).stdout
        else:
            out = subprocess.run(
                ['ps', '-ef'], capture_output=True, text=True, timeout=10
            ).stdout
        print('DEBUG: process list at timeout:\n{}'.format(out), flush=True)
    except Exception as e:
        print('DEBUG: failed to dump process list: {}'.format(e), flush=True)


class SubprocessWrapper:

    def __init__(self, executable):
        self.executable = executable
        self.stdout = None
        self.stderr = None
        self.returncode = None

    def run(self, args='', stdin_text=None, timeout=30):
        cmd = [self.executable] + (shlex.split(args) if args else [])
        # TEMPORARY: plain print() (not logging.debug) so this shows up in CI output regardless
        # of behave's default log-capture level, while diagnosing an intermittent Windows-only
        # hang in `plugin:add`. Remove once root-caused.
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
            _dump_process_tree()
            raise
        self.stdout = result.stdout
        self.stderr = result.stderr
        self.returncode = result.returncode
        print('DEBUG: stdout: {!r}'.format(self.stdout), flush=True)
        print('DEBUG: stderr: {!r}'.format(self.stderr), flush=True)
        print('DEBUG: returncode: {}'.format(self.returncode), flush=True)
