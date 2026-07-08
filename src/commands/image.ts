import {
  type ArgumentValues,
  type Context,
  IMAGE_PRINTER_SERVICE_ID,
  type ImagePrinterService,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";
import logoAsset from "../../assets/logo.png" with { type: "file" };

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

    const imageBuffer = await Bun.file(logoAsset).bytes();
    const imageOutput = await imagePrinterService.image(imageBuffer, 25, "#FFFFFF");
    await printerService.print(imageOutput + "\n");
  },
};

export default image;
