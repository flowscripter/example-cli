import {
  AsciiBannerGeneratorServiceProvider,
  BannerServiceProvider,
  DataDumpGeneratorServiceProvider,
  launchMultiCommandCLI,
  SyntaxHighlighterServiceProvider,
  TreePrinterServiceProvider,
} from "@flowscripter/dynamic-cli-framework";
import demo from "./commands/demo.ts";
import packageJson from "../package.json";

export async function cli(): Promise<void> {
  await launchMultiCommandCLI(
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
    },
  );
}
