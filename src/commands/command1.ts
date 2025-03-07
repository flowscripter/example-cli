import {
  type ArgumentValues,
  ASCII_BANNER_GENERATOR_SERVICE_ID,
  type AsciiBannerGeneratorService,
  type Context,
  Icon,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";

async function sleep(seconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const command1: SubCommand = {
  name: "command1",
  description: "Demonstrates printer service features",
  options: [],
  positionals: [],
  execute: async (
    context: Context,
    _argumentValues: ArgumentValues,
  ): Promise<void> => {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const asciiBannerGenerator = context.getServiceById(
      ASCII_BANNER_GENERATOR_SERVICE_ID,
    ) as AsciiBannerGeneratorService;

    await printerService.print("Hello, World!\n");

    await printerService.info("This is an info level message\n");
    await printerService.debug("This is a debug level message\n");
    await printerService.warn("This is a warn level message\n");
    await printerService.error("This is an error level message\n");

    await printerService.showSpinner("Waiting 3 seconds...");
    await sleep(1);
    await printerService.showSpinner("Waiting 2 seconds...");
    await sleep(1);
    await printerService.showSpinner("Waiting 1 seconds...");
    await sleep(1);
    await printerService.hideSpinner();

    await printerService.print("Finished waiting\n", Icon.SUCCESS);

    await sleep(0.5);

    const handle1 = await printerService.showProgressBar(
      "sec",
      "Waiting 3 seconds",
      3,
      0,
    );
    await sleep(1);
    printerService.updateProgressBar(handle1, 1);
    await sleep(1);
    printerService.updateProgressBar(handle1, 2);
    await sleep(1);
    printerService.updateProgressBar(handle1, 3);

    await printerService.print("Finished waiting\n", Icon.SUCCESS);

    await printerService.print(
      printerService.green(
        await asciiBannerGenerator.generate("Goodbye!", "standard"),
      ) + "\n",
    );
  },
};

export default command1;
