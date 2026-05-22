import {
  type ArgumentValues,
  ASCII_BANNER_GENERATOR_SERVICE_ID,
  type AsciiBannerGeneratorService,
  ChiselFontAsciiBannerGeneratorService,
  COMPLETION_SERVICE_ID,
  type CompletionService,
  type Context,
  KEY_VALUE_SERVICE_ID,
  type KeyValueService,
  PRINTER_SERVICE_ID,
  type PrinterService,
  ShellType,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";

const command6: SubCommand = {
  name: "command6",
  description:
    "Demonstrates secrets storage, completion service, chisel font ASCII banner, and ASCII banner subtitle",
  options: [],
  positionals: [],
  execute: async (
    context: Context,
    _argumentValues: ArgumentValues,
  ): Promise<void> => {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const keyValueService = context.getServiceById(
      KEY_VALUE_SERVICE_ID,
    ) as KeyValueService;
    const completionService = context.getServiceById(
      COMPLETION_SERVICE_ID,
    ) as CompletionService;
    const asciiBannerService = context.getServiceById(
      ASCII_BANNER_GENERATOR_SERVICE_ID,
    ) as AsciiBannerGeneratorService;

    // --- Secrets Demo ---
    await printerService.print("--- Secrets Demo ---\n");

    try {
      await keyValueService.setKey("demo-api-key", "sk-secret-12345", true);
      await printerService.print("Stored secret: demo-api-key\n");

      const exists = await keyValueService.hasKey("demo-api-key");
      await printerService.print(`Key exists: ${exists}\n`);

      const secret = await keyValueService.getKey("demo-api-key");
      const masked = secret.substring(0, 3) + "***";
      await printerService.print(`Retrieved secret (masked): ${masked}\n`);

      await keyValueService.deleteKey("demo-api-key");
      await printerService.print("Deleted secret: demo-api-key\n");
    } catch (error) {
      await printerService.warn(
        `Secret storage unavailable (OS keyring may be locked): ${
          (error as Error).message
        }\n`,
      );
      await printerService.print(
        "Falling back to non-secret storage demo...\n",
      );
      await keyValueService.setKey("demo-key", "example-value");
      await printerService.print("Stored key: demo-key\n");

      const value = await keyValueService.getKey("demo-key");
      await printerService.print(`Retrieved value: ${value}\n`);

      await keyValueService.deleteKey("demo-key");
      await printerService.print("Deleted key: demo-key\n");
    }

    // --- Completion Demo ---
    await printerService.print("--- Completion Demo ---\n");

    const bootstrapScript = completionService.getBootstrapScript(
      ShellType.BASH,
      "example-cli",
    );
    await printerService.print(`Bash bootstrap script:\n${bootstrapScript}\n`);

    const configPath = completionService.getDefaultConfigPath(ShellType.BASH);
    await printerService.print(`Bash default config path: ${configPath}\n`);

    // --- Chisel Font ASCII Banner Demo ---
    await printerService.print("--- Chisel Font ASCII Banner Demo ---\n");

    const chiselBanner = new ChiselFontAsciiBannerGeneratorService();
    const chiselResult = await chiselBanner.generate("CHISEL");
    await printerService.print(chiselResult + "\n");

    // --- ASCII Banner Subtitle Demo ---
    await printerService.print("--- ASCII Banner Subtitle Demo ---\n");

    const subtitleResult = await asciiBannerService.generate("Hello", {
      fontName: "standard",
      subMessage: "A subtitle message",
    });
    await printerService.print(subtitleResult + "\n");
  },
};

export default command6;
