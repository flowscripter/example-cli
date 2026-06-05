import {
  type ArgumentValues,
  type Context,
  Icon,
  PRINTER_SERVICE_ID,
  type PrinterService,
  SHUTDOWN_SERVICE_ID,
  type ShutdownService,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";

async function sleep(seconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const interruption: SubCommand = {
  name: "interruption",
  description:
    "Demonstrates graceful shutdown with signal handling (press Ctrl+C to interrupt)",
  options: [],
  positionals: [],
  execute: async (
    context: Context,
    _argumentValues: ArgumentValues,
  ): Promise<void> => {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const shutdownService = context.getServiceById(
      SHUTDOWN_SERVICE_ID,
    ) as ShutdownService;

    await printerService.print(
      "Entering long-running mode. Press Ctrl+C to request graceful shutdown...\n",
    );

    shutdownService.enterLongRunningMode();
    try {
      for (let i = 1; i <= 30; i++) {
        await printerService.showSpinner(`Working... iteration ${i}/30`);
        await sleep(1);

        if (shutdownService.isShutdownRequested) {
          await printerService.hideSpinner();
          await printerService.print(
            "Shutdown requested, finishing gracefully...\n",
            Icon.ALERT,
          );
          break;
        }
      }

      await printerService.hideSpinner();

      if (!shutdownService.isShutdownRequested) {
        await printerService.print("Work completed normally\n", Icon.SUCCESS);
      }
    } finally {
      shutdownService.leaveLongRunningMode();
      await printerService.print("Exited long-running mode\n", Icon.SUCCESS);
    }
  },
};

export default interruption;
