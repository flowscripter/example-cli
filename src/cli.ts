import {
  AsciiBannerGeneratorServiceProvider,
  BannerServiceProvider,
  launchMultiCommandCLI,
  SyntaxHighlighterServiceProvider,
} from "@flowscripter/dynamic-cli-framework";
import command1 from "./commands/command1.ts";
import command2 from "./commands/command2.ts";

/**
 * Run the CLI.
 */
export async function cli(callingModuleUri: string): Promise<void> {
  // use launchMultiCommandCLI to show 2 sample commands
  await launchMultiCommandCLI(
    [command1, command2],
    "Simple example CLI using dynamic-cli-framework.",
    `example-cli`, // alternatively, name can be derived from executable name if this is not defined
    undefined, // version will be derived from callingModuleUrl
    false, // simple example, so disable env vars support for configuration defaults
    false, // simple example, so disable configuration support
    false, // simple example, so disable key-value service
    callingModuleUri,
    [
      new BannerServiceProvider(50), // renders an ascii banner on CLI launch
      new AsciiBannerGeneratorServiceProvider(45), // exposes ascii banner generation service
      new SyntaxHighlighterServiceProvider(40), // exposes syntax highlighting service
    ],
  );
}
