import platform
import shlex
import subprocess
import threading
import time
import logging

log = logging.getLogger("subprocess_wrapper")


def _process_snapshot():
    # TEMPORARY: diagnosing an intermittent Windows-only hang in `plugin:add`. `tasklist` alone
    # doesn't show parent/child relationships or full command lines, so a renamed or wrapped
    # process (e.g. a `cmd.exe /c bun.exe ...` shell hop) can't be distinguished from a process
    # that never launched at all. Use PowerShell's Get-CimInstance for that detail on Windows.
    try:
        if platform.system() == 'Windows':
            ps_cmd = (
                "Get-CimInstance Win32_Process | "
                "Select-Object ProcessId,ParentProcessId,Name,CommandLine | "
                "Format-Table -AutoSize -Wrap | Out-String -Width 300"
            )
            out = subprocess.run(
                ['powershell', '-NoProfile', '-Command', ps_cmd],
                capture_output=True, text=True, timeout=10
            ).stdout
        else:
            out = subprocess.run(
                ['ps', '-ef'], capture_output=True, text=True, timeout=10
            ).stdout
        return out
    except Exception as e:
        return 'failed to snapshot process list: {}'.format(e)


class _ProcessTreeMonitor:
    # TEMPORARY: diagnosing an intermittent Windows-only hang in `plugin:add`. Polls the process
    # tree every few seconds while a subprocess is running (rather than only once at timeout) so
    # we can see whether the child process ever appears, and if so, whether it appears and then
    # disappears before the outer timeout fires. Remove once root-caused.
    def __init__(self, interval_seconds=5):
        self.interval_seconds = interval_seconds
        self._stop_event = threading.Event()
        self._thread = None
        self._start_time = None

    def _run(self):
        while not self._stop_event.wait(self.interval_seconds):
            elapsed = time.monotonic() - self._start_time
            snapshot = _process_snapshot()
            print(
                'DEBUG: process snapshot at +{:.1f}s:\n{}'.format(elapsed, snapshot),
                flush=True,
            )

    def __enter__(self):
        self._start_time = time.monotonic()
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self._stop_event.set()
        if self._thread is not None:
            self._thread.join(timeout=self.interval_seconds + 5)


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
            with _ProcessTreeMonitor(interval_seconds=5):
                result = subprocess.run(
                    cmd, capture_output=True, text=True, timeout=timeout, input=stdin_text,
                    encoding='utf-8', errors='replace'
                )
        except subprocess.TimeoutExpired as e:
            print('DEBUG: TIMED OUT after {}s'.format(timeout), flush=True)
            print('DEBUG: partial stdout: {!r}'.format(e.stdout), flush=True)
            print('DEBUG: partial stderr: {!r}'.format(e.stderr), flush=True)
            print(
                'DEBUG: final process snapshot at timeout:\n{}'.format(_process_snapshot()),
                flush=True,
            )
            raise
        self.stdout = result.stdout
        self.stderr = result.stderr
        self.returncode = result.returncode
        print('DEBUG: stdout: {!r}'.format(self.stdout), flush=True)
        print('DEBUG: stderr: {!r}'.format(self.stderr), flush=True)
        print('DEBUG: returncode: {}'.format(self.returncode), flush=True)
