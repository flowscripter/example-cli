import {
  type ArgumentValues,
  ArgumentValueTypeName,
  type Context,
  PRINTER_SERVICE_ID,
  type PrinterService,
  type Prompt,
  PROMPTER_SERVICE_ID,
  type PrompterService,
  PromptType,
  type SubCommand,
} from "@flowscripter/dynamic-cli-framework";

const prompting: SubCommand = {
  name: "prompting",
  description:
    "Demonstrates prompts, argument validation, argument value prompting, and URL opening",
  options: [
    {
      name: "age",
      description: "Your age",
      type: ArgumentValueTypeName.NUMBER,
      shortAlias: "a",
      isOptional: true,
      validate: (value): string | undefined => {
        const num = value as number;
        if (num < 0 || num > 150) {
          return "Age must be between 0 and 150";
        }
        return undefined;
      },
    },
  ],
  positionals: [
    {
      name: "name",
      description: "Your name (must be at least 2 characters)",
      type: ArgumentValueTypeName.STRING,
      validate: (value): string | undefined => {
        const str = value as string;
        if (str.length < 2) {
          return "Name must be at least 2 characters";
        }
        return undefined;
      },
    },
  ],
  async execute(
    context: Context,
    argumentValues: ArgumentValues,
  ): Promise<void> {
    const printerService = context.getServiceById(
      PRINTER_SERVICE_ID,
    ) as PrinterService;
    const prompterService = context.getServiceById(
      PROMPTER_SERVICE_ID,
    ) as PrompterService;

    await printerService.print(
      "Argument values: " + JSON.stringify(argumentValues, null, 2) + "\n",
    );

    const colorPrompt: Prompt = {
      name: "favoriteColor",
      promptText: "What is your favorite color?",
      type: PromptType.TEXT,
      defaultOption: {
        displayValue: "blue",
        returnedValue: "blue",
      },
      options: [],
    };

    const languagePrompt: Prompt = {
      name: "programmingLanguage",
      promptText: "Choose a programming language:",
      type: PromptType.SINGLE_SELECT,
      options: [
        { displayValue: "TypeScript", returnedValue: "TypeScript" },
        { displayValue: "Python", returnedValue: "Python" },
        { displayValue: "Rust", returnedValue: "Rust" },
        { displayValue: "Go", returnedValue: "Go" },
      ],
    };

    const notificationsPrompt: Prompt = {
      name: "enableNotifications",
      promptText: "Enable notifications?",
      type: PromptType.TOGGLE,
      options: [],
    };

    const openUrlPrompt: Prompt = {
      name: "openProject",
      promptText: "Open the project page?",
      type: PromptType.OPEN_URL,
      options: [
        {
          displayValue: "Flowscripter GitHub",
          returnedValue: "https://github.com/flowscripter",
        },
      ],
    };

    const results = await prompterService.promptAll([
      colorPrompt,
      languagePrompt,
      notificationsPrompt,
      openUrlPrompt,
    ]);

    await printerService.print("Prompt results:\n");
    for (const result of results) {
      await printerService.print(
        `  ${result.name}: ${JSON.stringify(result.value)}\n`,
      );
    }
  },
};

export default prompting;
