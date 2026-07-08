import {
  Align,
  type ArgumentValues,
  ASCII_BANNER_GENERATOR_SERVICE_ID,
  type AsciiBannerGeneratorService,
  type Context,
  DATA_DUMP_GENERATOR_SERVICE_ID,
  type DataDumpGeneratorService,
  DumpFormat,
  Icon,
  PRINTER_SERVICE_ID,
  type PrinterService,
  ProgressStyle,
  SpinnerStyle,
  type SubCommand,
  Table,
  TABLE_GENERATOR_SERVICE_ID,
  type TableGeneratorService,
  TREE_PRINTER_SERVICE_ID,
  type TreeNode,
  type TreePrinterService,
} from "@flowscripter/dynamic-cli-framework";
import { Buffer } from "node:buffer";

async function sleep(seconds: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const printing: SubCommand = {
  name: "printing",
  description: "Demonstrates printer, tree, table, data dump, and banner output features",
  options: [],
  positionals: [],
  execute: async (context: Context, _argumentValues: ArgumentValues): Promise<void> => {
    const printerService = context.getServiceById(PRINTER_SERVICE_ID) as PrinterService;
    const asciiBannerGenerator = context.getServiceById(
      ASCII_BANNER_GENERATOR_SERVICE_ID,
    ) as AsciiBannerGeneratorService;
    const treePrinterService = context.getServiceById(
      TREE_PRINTER_SERVICE_ID,
    ) as TreePrinterService;
    const tableGeneratorService = context.getServiceById(
      TABLE_GENERATOR_SERVICE_ID,
    ) as TableGeneratorService;
    const dataDumpGeneratorService = context.getServiceById(
      DATA_DUMP_GENERATOR_SERVICE_ID,
    ) as DataDumpGeneratorService;

    // --- Basic Printer ---
    await printerService.print("--- Basic Printer ---\n");
    await printerService.print("Hello, World!\n");
    await printerService.info("This is an info level message\n");
    await printerService.debug("This is a debug level message\n");
    await printerService.warn("This is a warn level message\n");
    await printerService.error("This is an error level message\n");

    // --- Default Spinner + Progress Bar ---
    await printerService.print("--- Default Spinner + Progress Bar ---\n");

    await printerService.showSpinner("Waiting 3 seconds...");
    await sleep(1);
    await printerService.showSpinner("Waiting 2 seconds...");
    await sleep(1);
    await printerService.showSpinner("Waiting 1 seconds...");
    await sleep(1);
    await printerService.hideSpinner();
    await printerService.print("Finished waiting\n", Icon.SUCCESS);

    await sleep(0.5);

    const handle1 = await printerService.showProgressBar("sec", "Waiting 3 seconds", 3, 0);
    await sleep(1);
    printerService.updateProgressBar(handle1, 1);
    await sleep(1);
    printerService.updateProgressBar(handle1, 2);
    await sleep(1);
    printerService.updateProgressBar(handle1, 3);
    await printerService.print("Finished waiting\n", Icon.SUCCESS);

    // --- Star Spinner + Fill Progress Bar ---
    await printerService.print("--- Star Spinner + Fill Progress Bar ---\n");

    await printerService.showSpinner("Waiting 3 seconds...", SpinnerStyle.STAR);
    await sleep(1);
    await printerService.showSpinner("Waiting 2 seconds...", SpinnerStyle.STAR);
    await sleep(1);
    await printerService.showSpinner("Waiting 1 seconds...", SpinnerStyle.STAR);
    await sleep(1);
    await printerService.hideSpinner();
    await printerService.print("Finished waiting\n", Icon.SUCCESS);

    await sleep(0.5);

    const handle2 = await printerService.showProgressBar(
      "sec",
      "Waiting 3 seconds",
      3,
      0,
      ProgressStyle.FILL,
    );
    await sleep(1);
    printerService.updateProgressBar(handle2, 1);
    await sleep(1);
    printerService.updateProgressBar(handle2, 2);
    await sleep(1);
    printerService.updateProgressBar(handle2, 3);
    await printerService.print("Finished waiting\n", Icon.SUCCESS);

    // --- Colors ---
    await printerService.print("--- Colors ---\n");
    await printerService.print(printerService.green("Green text") + "\n");
    await printerService.print(printerService.backgroundRed("Background Red") + "\n");
    await printerService.print(printerService.backgroundBlue("Background Blue") + "\n");
    await printerService.print(printerService.backgroundGreen("Background Green") + "\n");
    await printerService.print(printerService.backgroundCyan("Background Cyan") + "\n");
    await printerService.print(
      printerService.backgroundColor("Custom Hex Background", "#FF6600") + "\n",
    );

    // --- Italic ---
    await printerService.print("--- Italic ---\n");
    await printerService.print(printerService.italic("Italic text") + "\n");

    // --- Hyperlink ---
    await printerService.print("--- Hyperlink ---\n");
    await printerService.print(
      printerService.hyperlink("Flowscripter on GitHub", "https://github.com/flowscripter") + "\n",
    );

    // --- ASCII Banner ---
    await printerService.print("--- ASCII Banner ---\n");
    await printerService.print(
      printerService.green(
        await asciiBannerGenerator.generate("Goodbye!", {
          fontName: "standard",
        }),
      ) + "\n",
    );

    // --- Tree ---
    await printerService.print("--- Tree ---\n");
    const tree: TreeNode = {
      label: "Project",
      children: [
        {
          label: "src/",
          children: [
            "cli.ts",
            {
              label: "commands/",
              children: ["printing.ts", "prompting.ts"],
            },
          ],
        },
        {
          label: "tests/",
          children: ["cli_test.ts"],
        },
        "package.json",
      ],
    };
    await printerService.print(treePrinterService.print(tree) + "\n");

    // --- Table ---
    await printerService.print("--- Table ---\n");
    const table = new Table(4, 3, { border: true })
      .column(0, { align: Align.LEFT })
      .column(2, { align: Align.LEFT })
      .cell(0, 0, "Service")
      .cell(0, 1, "ID")
      .cell(0, 2, "Description")
      .cell(1, 0, "Printer")
      .cell(1, 1, "printer-service")
      .cell(1, 2, "Output formatting")
      .cell(2, 0, "Tree")
      .cell(2, 1, "tree-printer-service")
      .cell(2, 2, "Tree rendering")
      .cell(3, 0, "Table")
      .cell(3, 1, "table-generator-service")
      .cell(3, 2, "Table rendering");
    await printerService.print(tableGeneratorService.render(table) + "\n");

    // --- Data Dump ---
    await printerService.print("--- Data Dump ---\n");
    const data = Buffer.from("Hello, dynamic-cli-framework!");
    const hexDump = dataDumpGeneratorService.generate(data, {
      format: DumpFormat.HEX,
    });
    await printerService.print(hexDump + "\n");
  },
};

export default printing;
