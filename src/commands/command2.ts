import {
  type ArgumentValues,
  ArgumentValueTypeName,
  ComplexValueTypeName,
  type Context,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type SubCommand,
  SYNTAX_HIGHLIGHTER_SERVICE_ID,
  type SyntaxHighlighterService,
} from "@flowscripter/dynamic-cli-framework";

const command2: SubCommand = {
  name: "command2",
  description: "Demonstrates argument features and syntax highlighter service",
  options: [
    {
      name: "booleanOption",
      description: "A boolean option",
      type: ArgumentValueTypeName.BOOLEAN,
      shortAlias: "b",
      isOptional: true,
    },
    {
      name: "numberOption",
      description: "A number option",
      type: ArgumentValueTypeName.NUMBER,
      shortAlias: "n",
      isOptional: true,
    },
    {
      name: "stringOption",
      description: "A string option",
      type: ArgumentValueTypeName.STRING,
      shortAlias: "s",
      isOptional: true,
    },
    {
      name: "complexOption",
      description: "An optional complex option",
      type: ComplexValueTypeName.COMPLEX,
      shortAlias: "c",
      isOptional: true,
      properties: [
        {
          name: "numberSubOption",
          description: "A number sub-option",
          type: ArgumentValueTypeName.NUMBER,
          shortAlias: "n",
          isArray: true,
        },
      ],
    },
  ],
  positionals: [
    {
      name: "booleanPositional",
      description: "A boolean positional",
      type: ArgumentValueTypeName.BOOLEAN,
    },
    {
      name: "numberPositional",
      description: "A number positional",
      type: ArgumentValueTypeName.NUMBER,
    },
    {
      name: "stringPositional",
      description: "A string positional",
      type: ArgumentValueTypeName.STRING,
    },
  ],
  usageExamples: [
    {
      exampleArguments: "true 1 hello",
      description: "Required positional arguments",
      output: [
        "{",
        '  "booleanPositional": true,',
        '  "numberPositional": 1,',
        '  "stringPositional": "hello"',
        "}",
      ],
    },
    {
      exampleArguments: "true 1 --booleanOption hello",
      description: "Required positional arguments and optional boolean option",
      output: [
        "{",
        '  "booleanPositional": true,',
        '  "numberPositional": 1,',
        '  "booleanOption": true,',
        '  "stringPositional": "hello"',
        "}",
      ],
    },
    {
      exampleArguments: 'true 1 hello -b -n 2 -s "hello world" -c.n=1 -c.n=2',
      description: "Complex arguments with short aliases",
      output: [
        "{",
        '  "booleanPositional": true,',
        '  "numberPositional": 1,',
        '  "stringPositional": "hello"',
        '  "booleanOption": true,',
        '  "numberOption": 2,',
        '  "stringOption": "hello world",',
        '  "complexOption": {',
        '    "numberSubOption": [',
        "      1,",
        "      2",
        "    ]",
        "  }",
        "}",
      ],
    },
  ],
  async execute(
    context: Context,
    argumentValues: ArgumentValues,
  ): Promise<void> {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const highlighterService = context.getServiceById(
      SYNTAX_HIGHLIGHTER_SERVICE_ID,
    ) as SyntaxHighlighterService;

    await printerService.print(
      highlighterService.highlight(
        JSON.stringify(argumentValues, null, 2),
        "json",
      ) + "\n",
    );
  },
};

export default command2;
