import {
  AsciiBannerGeneratorServiceProvider,
  BannerServiceProvider,
  DataDumpGeneratorServiceProvider,
  launchDynamicPluginMultiCommandCLI,
  SyntaxHighlighterServiceProvider,
  TreePrinterServiceProvider,
} from "@flowscripter/dynamic-cli-framework";
import { SupportedArch, SupportedOs } from "@flowscripter/dynamic-cli-framework-api";
import {
  NpmPluginManager,
  NpmPluginRepository,
  NpmjsPluginRepository,
} from "@flowscripter/dynamic-plugin-framework";
import demo from "./commands/demo.ts";
import packageJson from "../package.json";
import path from "node:path";
import os from "node:os";

export async function cli(): Promise<void> {
  const pluginsDir = path.join(os.homedir(), ".example-cli", "plugins", "node_modules");
  const pluginManager = new NpmPluginManager(
    [
      new NpmjsPluginRepository({
        name: "npmjs",
        registryUrl: "https://registry.npmjs.org",
        packageJsonNamespace: "dynamic-cli-framework",
      }),
    ],
    new NpmPluginRepository(pluginsDir, "dynamic-cli-framework"),
  );

  await launchDynamicPluginMultiCommandCLI(
    pluginManager,
    [demo],
    "Simple example CLI using dynamic-cli-framework.",
    "example-cli",
    packageJson.version,
    [
      new BannerServiceProvider(50),
      new AsciiBannerGeneratorServiceProvider(45),
      new SyntaxHighlighterServiceProvider(40),
      new TreePrinterServiceProvider(35),
      new DataDumpGeneratorServiceProvider(30),
    ],
    {
      configFileSupportEnabled: true,
      keyValueServiceEnabled: true,
      secretServiceEnabled: true,
      argumentPrompterServiceEnabled: true,
      completionServiceEnabled: true,
      imagePrinterServiceEnabled: true,
      spawnServiceEnabled: true,
      upgradeServiceEnabled: false,
      upgradeLocationsConfig: {
        supportedPlatforms: [
          { os: SupportedOs.LINUX, arch: SupportedArch.X64 },
          { os: SupportedOs.LINUX, arch: SupportedArch.ARM64 },
          { os: SupportedOs.MACOS, arch: SupportedArch.X64 },
          { os: SupportedOs.MACOS, arch: SupportedArch.ARM64 },
          { os: SupportedOs.WINDOWS, arch: SupportedArch.X64 },
        ],
        githubRelease: {
          owner: "flowscripter",
          repo: "example-cli",
          assetPattern: "example-cli_{os}_{arch}.zip",
        },
        linuxScript: {
          scriptUrl:
            "https://raw.githubusercontent.com/flowscripter/example-cli/main/script/install.sh",
        },
        homebrew: {
          tap: "flowscripter/tap",
          formula: "example-cli",
        },
        winget: {
          packageId: "Flowscripter.example-cli",
        },
      },
    },
  );
}
