import { describe, expect, test } from "bun:test";
import { BannerServiceProvider } from "@flowscripter/dynamic-cli-framework";
import {
  ASCII_BANNER_GENERATOR_SERVICE_ID,
  PRINTER_SERVICE_ID,
  UPGRADE_SERVICE_ID,
} from "@flowscripter/dynamic-cli-framework-api";
import type { Context } from "@flowscripter/dynamic-cli-framework-api";

// Functional test for dynamic-cli-framework#141: the startup banner must print the
// upgrade-availability hint "(X.Y.Z available, run 'app upgrade')" on the SAME line as
// "version: X.Y.Z", rather than as a separate line (the pre-fix behaviour).
//
// This drives the real, installed BannerServiceProvider@5.0.6 - the exact class example-cli's
// src/cli.ts instantiates (`new BannerServiceProvider(50)`) - with a stub UpgradeService that
// reports an upgrade as available.
//
// Why not a full black-box run of the built executable (as the #142 test below does)? Because in
// the real running CLI, BannerServiceProvider's configured priority (50) initialises before the
// framework's built-in UpgradeServiceProvider (priority 6, see BaseCLI.ts) has called
// setDependencies() on the upgrade service - services initialise in descending-priority order
// (DefaultServiceProviderRegistry.getServiceProviders()). So the banner's *opportunistic* upgrade
// check on a freshly spawned process always observes a not-yet-wired FetchService and resolves to
// a "failed" check, regardless of network speed or mocking - confirmed by direct reproduction
// against both `bun run` and a `--compile`d binary. That is a pre-existing framework behaviour
// unrelated to the #141 formatting fix itself, so an external black-box test can't reliably
// observe the hint. Driving BannerServiceProvider directly (as done here) isolates and verifies
// the actual formatting fix.

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

function createStubUpgradeService(updateAvailable: boolean, latestVersion: string) {
  return {
    getUpgradeCheckResult: () =>
      Promise.resolve(
        updateAvailable
          ? { status: "checked", updateAvailable: true, latestVersion }
          : { status: "checked", updateAvailable: false, latestVersion },
      ),
  };
}

function createContext(
  printerService: unknown,
  asciiBannerGeneratorService: unknown,
  upgradeService: unknown,
): Context {
  const services: Record<string, unknown> = {
    [PRINTER_SERVICE_ID]: printerService,
    [ASCII_BANNER_GENERATOR_SERVICE_ID]: asciiBannerGeneratorService,
    [UPGRADE_SERVICE_ID]: upgradeService,
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
    const provider = new BannerServiceProvider(50);
    const context = createContext(
      createStubPrinterService(lines),
      createStubAsciiBannerGeneratorService(),
      createStubUpgradeService(true, "99.0.0"),
    );

    await provider.initService(context);

    const versionLine = lines.find((line) => line.includes("version:"));
    expect(versionLine).toBeDefined();
    expect(versionLine).toContain("version: 1.8.2 (99.0.0 available, run 'example-cli upgrade')");
  });

  test("does not print a hint when no upgrade is available", async () => {
    const lines: string[] = [];
    const provider = new BannerServiceProvider(50);
    const context = createContext(
      createStubPrinterService(lines),
      createStubAsciiBannerGeneratorService(),
      createStubUpgradeService(false, "1.8.2"),
    );

    await provider.initService(context);

    const versionLine = lines.find((line) => line.includes("version:"));
    expect(versionLine).toBeDefined();
    expect(versionLine).not.toContain("available");
    expect(versionLine).toContain("version: 1.8.2");
  });
});
