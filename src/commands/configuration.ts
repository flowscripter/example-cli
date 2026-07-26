import {
  type Values,
  type Context,
  KEY_VALUE_SERVICE_ID,
  type KeyValueService,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";
import { Secret } from "@flowscripter/dynamic-cli-framework-api";

const configuration: SubCommand = {
  name: "configuration",
  description: "Demonstrates secrets storage and key-value service",
  options: [],
  positionals: [],
  async execute(context: Context, _argumentValues: Values): Promise<void> {
    const printerService = context.getServiceById(PRINTER_SERVICE_ID) as PrinterService;
    const keyValueService = context.getServiceById(KEY_VALUE_SERVICE_ID) as KeyValueService;

    // --- Key-Value Storage ---
    await printerService.print("--- Key-Value Storage ---\n");

    await keyValueService.set("demo-string", "hello world");
    await keyValueService.set("demo-number", "42");
    await keyValueService.set("demo-json", '{"enabled":true,"retries":3}');

    const keys = ["demo-string", "demo-number", "demo-json"];
    for (const key of keys) {
      const value = await keyValueService.get(key);
      await printerService.print(`  ${key} = ${value}\n`);
    }

    const missing = await keyValueService.has("demo-nonexistent");
    await printerService.print(`  demo-nonexistent exists: ${missing}\n`);

    for (const key of keys) {
      await keyValueService.delete(key);
    }
    await printerService.print("Cleaned up keys\n");

    // --- Secret Storage ---
    await printerService.print("--- Secret Storage ---\n");

    try {
      await keyValueService.set("demo-api-key", new Secret("sk-secret-12345"));
      await printerService.print("Stored secret: demo-api-key\n");

      const exists = await keyValueService.has("demo-api-key");
      await printerService.print(`Key exists: ${exists}\n`);

      const secret = await keyValueService.get<string>("demo-api-key");
      const masked = secret.substring(0, 3) + "***";
      await printerService.print(`Retrieved secret (masked): ${masked}\n`);

      await keyValueService.delete("demo-api-key");
      await printerService.print("Deleted secret: demo-api-key\n");
    } catch (error) {
      await printerService.warn(
        `Secret storage unavailable (OS keyring may be locked): ${(error as Error).message}\n`,
      );
    }
  },
};

export default configuration;
