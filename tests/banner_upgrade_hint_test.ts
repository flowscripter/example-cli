import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import packageJson from "../package.json";

// Functional test: the startup banner must print the
// upgrade-availability hint "(X.Y.Z available, run 'app upgrade')" on the SAME line as
// "version: X.Y.Z", sourced from the cached upgrade-check result.
//
// bannerStartupTask.ts only honours a cached result coming from the framework's own
// DefaultUpgradeService (via an `instanceof` check) - that class isn't part of the package's
// public exports, so it can't be stubbed from outside the framework. Instead this drives the
// real CLI end to end (same pattern as tests/version_command_test.ts), pre-seeding the on-disk
// config file's "services" key-value scope for UPGRADE_SERVICE_ID
// ("@flowscripter/dynamic-cli-framework/upgrade-service") with the cached
// "upgrade-check-result" entry that DefaultUpgradeService.getCachedUpgradeCheckResult() reads -
// the same entry refreshUpgradeCheckCache() would have written from a prior run.
const PROJECT_ROOT = path.join(import.meta.dir, "..");
const UPGRADE_SERVICE_ID = "@flowscripter/dynamic-cli-framework/upgrade-service";

let homeDir: string;

beforeEach(async () => {
  homeDir = await mkdtemp(join(tmpdir(), "example-cli-home-"));
});

afterEach(async () => {
  await rm(homeDir, { recursive: true, force: true });
});

async function seedUpgradeCheckCache(
  updateAvailable: boolean,
  latestVersion: string,
): Promise<void> {
  const config = {
    "key-values": {
      services: {
        [UPGRADE_SERVICE_ID]: {
          "upgrade-check-result": {
            status: "checked",
            currentVersion: packageJson.version,
            latestVersion,
            updateAvailable,
            os: "linux",
            arch: "x64",
            installMethod: "github-release",
          },
        },
      },
    },
  };
  await writeFile(join(homeDir, ".examplecli.json"), JSON.stringify(config));
}

function runCli(): { stderr: string } {
  const result = Bun.spawnSync([process.execPath, "run", "index.ts"], {
    cwd: PROJECT_ROOT,
    env: { ...process.env, HOME: homeDir },
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  return { stderr: result.stderr.toString("utf-8") };
}

describe("Banner upgrade hint (dynamic-cli-framework #141)", () => {
  test("prints the upgrade hint on the same line as the version when an upgrade is available", async () => {
    await seedUpgradeCheckCache(true, "99.0.0");

    const { stderr } = runCli();

    const versionLine = stderr.split("\n").find((line) => line.includes("version:"));
    expect(versionLine).toBeDefined();
    expect(versionLine).toContain(
      `version: ${packageJson.version} (99.0.0 available, run 'example-cli upgrade')`,
    );
  });

  test("does not print a hint when no upgrade is available", async () => {
    await seedUpgradeCheckCache(false, packageJson.version);

    const { stderr } = runCli();

    const versionLine = stderr.split("\n").find((line) => line.includes("version:"));
    expect(versionLine).toBeDefined();
    expect(versionLine).not.toContain("available");
    expect(versionLine).toContain(`version: ${packageJson.version}`);
  });
});
