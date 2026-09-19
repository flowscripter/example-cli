import { describe, expect, test } from "bun:test";
import { createBannerStartupTask } from "@flowscripter/dynamic-cli-framework";
import {
  ASCII_BANNER_GENERATOR_SERVICE_ID,
  KEY_VALUE_SERVICE_ID,
  PRINTER_SERVICE_ID,
} from "@flowscripter/dynamic-cli-framework-api";
import type { Context } from "@flowscripter/dynamic-cli-framework-api";

// Functional test for dynamic-cli-framework#141: the startup banner must print the
// upgrade-availability hint "(X.Y.Z available, run 'app upgrade')" on the SAME line as
// "version: X.Y.Z", rather than as a separate line (the pre-fix behaviour).
//
// This drives the real, installed banner StartupTask (from createBannerStartupTask(50), the
// factory example-cli's src/cli.ts now calls following the dynamic-cli-framework
// service-lifecycle redesign) with a stub KeyValueService reporting a cached "upgrade available"
// result.
//
// Following that redesign, the banner no longer calls a live UpgradeService at all - it does a
// cheap KeyValueService read of the previous run's cached upgrade-check result (see
// dynamic-cli-framework's bannerStartupTask.ts / UPGRADE_CHECK_CACHE_KEY - an internal cache key,
// not part of the public API surface, hardcoded below as "upgrade-check-result"; if the
// framework's internal key ever changes this test needs updating to match). This also removes the
// original #141 test's race entirely - the opportunistic upgrade check used to run concurrently
// with, and often lose to, the banner's own priority band - so there's no longer a reason this
// couldn't also be exercised as a full black-box run; kept as a direct unit test here for speed
// and because it isolates the formatting fix precisely.
const UPGRADE_CHECK_CACHE_KEY = "upgrade-check-result";

function createStubPrinterService(lines: string[]) {
  const identity = (message: string) => message;
  return {
    blue: identity,
    primary: identity,
    secondary: identity,
    info: (message: string) => {
      lines.push(message);
      return Promise.resolve();
    },
  };
}

function createStubAsciiBannerGeneratorService() {
  return {
    registerFont: () => {},
    getRegisteredFonts: () => [],
    generate: () => Promise.resolve("EXAMPLE-CLI"),
  };
}

function createStubKeyValueService(updateAvailable: boolean, latestVersion: string) {
  const cachedResult = updateAvailable
    ? { status: "checked", updateAvailable: true, latestVersion }
    : { status: "checked", updateAvailable: false, latestVersion };
  return {
    has: (key: string) => Promise.resolve(key === UPGRADE_CHECK_CACHE_KEY),
    get: (key: string) =>
      key === UPGRADE_CHECK_CACHE_KEY
        ? Promise.resolve(cachedResult)
        : Promise.reject(new Error(`Attempt to access unknown key: ${key}`)),
    set: () => Promise.reject(new Error("not implemented")),
    delete: () => Promise.reject(new Error("not implemented")),
  };
}

function createContext(
  printerService: unknown,
  asciiBannerGeneratorService: unknown,
  keyValueService: unknown,
): Context {
  const services: Record<string, unknown> = {
    [PRINTER_SERVICE_ID]: printerService,
    [ASCII_BANNER_GENERATOR_SERVICE_ID]: asciiBannerGeneratorService,
    [KEY_VALUE_SERVICE_ID]: keyValueService,
  };
  return {
    cliConfig: {
      name: "example-cli",
      description: "Simple example CLI using dynamic-cli-framework.",
      version: "1.8.2",
    },
    getServiceById: (id: string) => services[id],
    doesServiceExist: (id: string) => id in services,
  };
}

describe("Banner upgrade hint (dynamic-cli-framework #141)", () => {
  test("prints the upgrade hint on the same line as the version when an upgrade is available", async () => {
    const lines: string[] = [];
    const task = createBannerStartupTask(50);
    const context = createContext(
      createStubPrinterService(lines),
      createStubAsciiBannerGeneratorService(),
      createStubKeyValueService(true, "99.0.0"),
    );

    await task.run(context);

    const versionLine = lines.find((line) => line.includes("version:"));
    expect(versionLine).toBeDefined();
    expect(versionLine).toContain("version: 1.8.2 (99.0.0 available, run 'example-cli upgrade')");
  });

  test("does not print a hint when no upgrade is available", async () => {
    const lines: string[] = [];
    const task = createBannerStartupTask(50);
    const context = createContext(
      createStubPrinterService(lines),
      createStubAsciiBannerGeneratorService(),
      createStubKeyValueService(false, "1.8.2"),
    );

    await task.run(context);

    const versionLine = lines.find((line) => line.includes("version:"));
    expect(versionLine).toBeDefined();
    expect(versionLine).not.toContain("available");
    expect(versionLine).toContain("version: 1.8.2");
  });
});
