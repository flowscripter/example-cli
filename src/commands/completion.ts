import {
  type ArgumentValues,
  COMPLETION_SERVICE_ID,
  type CompletionService,
  type Context,
  PRINTER_SERVICE_ID,
  type PrinterService,
  ShellType,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";

const completion: SubCommand = {
  name: "completion",
  description: "Demonstrates shell completion service",
  options: [],
  positionals: [],
  execute: async (context: Context, _argumentValues: ArgumentValues): Promise<void> => {
    const printerService = context.getServiceById(PRINTER_SERVICE_ID) as PrinterService;
    const completionService = context.getServiceById(COMPLETION_SERVICE_ID) as CompletionService;

    const bootstrapScript = completionService.getBootstrapScript(ShellType.BASH, "example-cli");
    await printerService.print(`Bash bootstrap script:\n${bootstrapScript}\n`);

    const configPath = completionService.getDefaultConfigPath(ShellType.BASH);
    await printerService.print(`Bash default config path: ${configPath}\n`);
  },
};

export default completion;
