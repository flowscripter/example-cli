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

    def run(self, args='', stdin_text=None):
        cmd = [self.executable] + (shlex.split(args) if args else [])
        log.debug('running: {}'.format(cmd))
        result = subprocess.run(
            cmd, capture_output=True, text=True, timeout=30, input=stdin_text,
            encoding='utf-8', errors='replace'
        )
        self.stdout = result.stdout
        self.stderr = result.stderr
        self.returncode = result.returncode
        log.debug('stdout: {!r}'.format(self.stdout))
        log.debug('stderr: {!r}'.format(self.stderr))
        log.debug('returncode: {}'.format(self.returncode))
