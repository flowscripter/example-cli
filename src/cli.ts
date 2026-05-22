import process from "node:process";
import {
  AsciiBannerGeneratorServiceProvider,
  BannerServiceProvider,
  DataDumpGeneratorServiceProvider,
  DefaultImagePrinterService,
  IMAGE_PRINTER_SERVICE_ID,
  launchMultiCommandCLI,
  type ServiceInfo,
  type ServiceProvider,
  SyntaxHighlighterServiceProvider,
  type Terminal,
  TreePrinterServiceProvider,
} from "@flowscripter/dynamic-cli-framework";
import type CLIConfig from "@flowscripter/dynamic-cli-framework/src/api/CLIConfig.ts";
import type Context from "@flowscripter/dynamic-cli-framework/src/api/Context.ts";
import command1 from "./commands/command1.ts";
import command2 from "./commands/command2.ts";
import command3 from "./commands/command3.ts";
import command4 from "./commands/command4.ts";
import command5 from "./commands/command5.ts";
import command6 from "./commands/command6.ts";
import packageJson from "../package.json";

class StdoutTerminal implements Terminal {
  clearLine(): Promise<void> {
    process.stdout.write("\x1b[2K\x1b[G");
    return Promise.resolve();
  }
  clearUpLines(count: number): Promise<void> {
    process.stdout.write(("\x1b[1A\x1b[2K").repeat(count) + "\x1b[2K\x1b[G");
    return Promise.resolve();
  }
  hideCursor(): Promise<void> {
    process.stdout.write("\x1b[?25l");
    return Promise.resolve();
  }
  showCursor(): Promise<void> {
    process.stdout.write("\x1b[?25h");
    return Promise.resolve();
  }
  write(text: string): Promise<void> {
    process.stdout.write(text);
    return Promise.resolve();
  }
  columns(): number {
    return process.stdout.columns || 80;
  }
  rows(): number {
    return process.stdout.rows || 24;
  }
}

class ImageServiceProvider implements ServiceProvider {
  readonly serviceId = IMAGE_PRINTER_SERVICE_ID;
  constructor(readonly servicePriority: number) {}
  getServiceInfo(_cliConfig: CLIConfig): Promise<ServiceInfo> {
    return Promise.resolve({
      service: new DefaultImagePrinterService(new StdoutTerminal()),
      commands: [],
    });
  }
  initService(_context: Context): Promise<void> {
    return Promise.resolve();
  }
}

export async function cli(): Promise<void> {
  await launchMultiCommandCLI(
    [command1, command2, command3, command4, command5, command6],
    "Simple example CLI using dynamic-cli-framework.",
    "example-cli",
    packageJson.version,
    [
      new BannerServiceProvider(50),
      new AsciiBannerGeneratorServiceProvider(45),
      new SyntaxHighlighterServiceProvider(40),
      new TreePrinterServiceProvider(35),
      new DataDumpGeneratorServiceProvider(30),
      new ImageServiceProvider(20),
    ],
    {
      configFileSupportEnabled: true,
      keyValueServiceEnabled: true,
      secretServiceEnabled: true,
      argumentPrompterServiceEnabled: true,
      completionServiceEnabled: true,
    },
  );
}
