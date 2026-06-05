import {
  type ArgumentValues,
  ASCII_BANNER_GENERATOR_SERVICE_ID,
  type AsciiBannerGeneratorService,
  ChiselFontAsciiBannerGeneratorService,
  type Context,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";

const banners: SubCommand = {
  name: "banners",
  description:
    "Demonstrates chisel font ASCII banner and ASCII banner subtitle",
  options: [],
  positionals: [],
  execute: async (
    context: Context,
    _argumentValues: ArgumentValues,
  ): Promise<void> => {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const asciiBannerService = context.getServiceById(
      ASCII_BANNER_GENERATOR_SERVICE_ID,
    ) as AsciiBannerGeneratorService;

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

export default banners;
