import {
  type ArgumentValues,
  type Context,
  IMAGE_PRINTER_SERVICE_ID,
  type ImagePrinterService,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";
import path from "node:path";
import process from "node:process";

const image: SubCommand = {
  name: "image",
  description: "Demonstrates image rendering in the terminal",
  options: [],
  positionals: [],
  execute: async (context: Context, _argumentValues: ArgumentValues): Promise<void> => {
    const printerService = context.getServiceById(PRINTER_SERVICE_ID) as PrinterService;
    const imagePrinterService = context.getServiceById(
      IMAGE_PRINTER_SERVICE_ID,
    ) as ImagePrinterService;

    const baseDir = path.dirname(process.execPath);
    let imagePath = path.join(baseDir, "assets", "logo.png");
    const logoFile = Bun.file(imagePath);
    if (!(await logoFile.exists())) {
      imagePath = path.join(import.meta.dir, "..", "..", "assets", "logo.png");
    }
    const imageBuffer = await Bun.file(imagePath).bytes();
    const imageOutput = await imagePrinterService.image(imageBuffer, 25, "#FFFFFF");
    await printerService.print(imageOutput + "\n");
  },
};

export default image;
