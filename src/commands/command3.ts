import {
  type ArgumentValues,
  type Context,
  Icon,
  IMAGE_PRINTER_SERVICE_ID,
  type ImagePrinterService,
  PRINTER_SERVICE_ID,
  type PrinterService,
  ProgressStyle,
  SpinnerStyle,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";
import path from "node:path";
import process from "node:process";

async function sleep(seconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const command3: SubCommand = {
  name: "command3",
  description: "Demonstrates printer features",
  options: [],
  positionals: [],
  execute: async (
    context: Context,
    _argumentValues: ArgumentValues,
  ): Promise<void> => {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const imagePrinterService = context.getServiceById(
      IMAGE_PRINTER_SERVICE_ID,
    ) as ImagePrinterService;

    // Spinner with STAR style
    await printerService.showSpinner("Waiting 3 seconds...", SpinnerStyle.STAR);
    await sleep(1);
    await printerService.showSpinner("Waiting 2 seconds...", SpinnerStyle.STAR);
    await sleep(1);
    await printerService.showSpinner("Waiting 1 seconds...", SpinnerStyle.STAR);
    await sleep(1);
    await printerService.hideSpinner();

    await printerService.print("Finished waiting\n", Icon.SUCCESS);

    await sleep(0.5);

    // Progress bar with FILL style
    const handle = await printerService.showProgressBar(
      "sec",
      "Waiting 3 seconds",
      3,
      0,
      ProgressStyle.FILL,
    );
    await sleep(1);
    printerService.updateProgressBar(handle, 1);
    await sleep(1);
    printerService.updateProgressBar(handle, 2);
    await sleep(1);
    printerService.updateProgressBar(handle, 3);

    await printerService.print("Finished waiting\n", Icon.SUCCESS);

    // Background colors
    await printerService.print(
      printerService.backgroundRed("Background Red") + "\n",
    );
    await printerService.print(
      printerService.backgroundBlue("Background Blue") + "\n",
    );
    await printerService.print(
      printerService.backgroundGreen("Background Green") + "\n",
    );
    await printerService.print(
      printerService.backgroundCyan("Background Cyan") + "\n",
    );
    await printerService.print(
      printerService.backgroundColor("Custom Hex Background", "#FF6600") + "\n",
    );

    // Hyperlink
    await printerService.print(
      printerService.hyperlink(
        "Flowscripter on GitHub",
        "https://github.com/flowscripter",
      ) + "\n",
    );

    // Image -- resolve relative to executable dir (for compiled), or project root (for dev)
    const baseDir = path.dirname(process.execPath);
    let imagePath = path.join(baseDir, "assets", "logo.png");
    const logoFile = Bun.file(imagePath);
    if (!(await logoFile.exists())) {
      imagePath = path.join(import.meta.dir, "..", "..", "assets", "logo.png");
    }
    const imageBuffer = await Bun.file(imagePath).bytes();
    const imageOutput = await imagePrinterService.image(imageBuffer, 25);
    await printerService.print(imageOutput + "\n");
  },
};

export default command3;
