import {
  Align,
  type ArgumentValues,
  type Context,
  DATA_DUMP_GENERATOR_SERVICE_ID,
  type DataDumpGeneratorService,
  DumpFormat,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
  Table,
  TABLE_GENERATOR_SERVICE_ID,
  type TableGeneratorService,
  TREE_PRINTER_SERVICE_ID,
  type TreeNode,
  type TreePrinterService,
} from "@flowscripter/dynamic-cli-framework";
import { Buffer } from "node:buffer";

const command5: SubCommand = {
  name: "command5",
  description:
    "Demonstrates tree printer, table generator, and data dump generator services",
  options: [],
  positionals: [],
  execute: async (
    context: Context,
    _argumentValues: ArgumentValues,
  ): Promise<void> => {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const treePrinterService = context.getServiceById(
      TREE_PRINTER_SERVICE_ID,
    ) as TreePrinterService;
    const tableGeneratorService = context.getServiceById(
      TABLE_GENERATOR_SERVICE_ID,
    ) as TableGeneratorService;
    const dataDumpGeneratorService = context.getServiceById(
      DATA_DUMP_GENERATOR_SERVICE_ID,
    ) as DataDumpGeneratorService;

    // --- Tree Demo ---
    await printerService.print("--- Tree Demo ---\n");

    const tree: TreeNode = {
      label: "Project",
      children: [
        {
          label: "src/",
          children: [
            "cli.ts",
            {
              label: "commands/",
              children: ["command1.ts", "command2.ts"],
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

    // --- Table Demo ---
    await printerService.print("--- Table Demo ---\n");

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

    // --- Data Dump Demo ---
    await printerService.print("--- Data Dump Demo ---\n");

    const data = Buffer.from("Hello, dynamic-cli-framework!");
    const hexDump = dataDumpGeneratorService.generate(data, {
      format: DumpFormat.HEX,
    });

    await printerService.print(hexDump + "\n");
  },
};

export default command5;
