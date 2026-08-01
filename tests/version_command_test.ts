import path from "node:path";
import { describe, expect, test } from "bun:test";

// Functional test for dynamic-cli-framework#142: the `version` command must no longer print the
// upgrade-availability hint - it should only ever print the plain version number. (The hint
// itself remains in the startup banner - see tests/banner_upgrade_hint_test.ts for #141.)
//
// This spawns example-cli's real executable entrypoint (`index.ts`, the same one the compiled
// binary runs) as a subprocess against the real installed @flowscripter/dynamic-cli-framework@5.0.6,
// so the exact `version` command code path is exercised end to end. No mocking is needed here:
// post-fix, VersionCommand.execute() prints `context.cliConfig.version` unconditionally and no
// longer consults the upgrade service at all, so this holds regardless of whether an upgrade is
// actually available on the real network.
//
// The banner (printed via printerService.info()) writes to stderr; command results (`version`'s
// own output, printed via printerService.print()) write to stdout.

const PROJECT_ROOT = path.join(import.meta.dir, "..");

function runCli(args: string[]): { exitCode: number; stdout: string; stderr: string } {
  const result = Bun.spawnSync([process.execPath, "run", "index.ts", ...args], {
    cwd: PROJECT_ROOT,
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  return {
    exitCode: result.exitCode,
    stdout: result.stdout.toString("utf-8"),
    stderr: result.stderr.toString("utf-8"),
  };
}

describe("version command output (dynamic-cli-framework #142)", () => {
  test("prints only the plain version number, with no upgrade hint", () => {
    const { exitCode, stdout, stderr } = runCli(["--no-banner", "version"]);

    expect(exitCode).toBe(0);
    expect(stdout).not.toContain("available");
    expect(stderr).not.toContain("available");
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test("its own output line is the bare version number even alongside the startup banner", () => {
    const { exitCode, stdout } = runCli(["version"]);

    expect(exitCode).toBe(0);
    // stdout only ever carries the version command's own print() output, never the banner
    // (which goes to stderr) - so this alone confirms the command output has no hint appended.
    expect(stdout).not.toContain("available");
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
