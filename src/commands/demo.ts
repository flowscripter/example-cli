import {
  type Context,
  type GroupCommand,
} from "@flowscripter/dynamic-cli-framework";
import printing from "./printing.ts";
import prompting from "./prompting.ts";
import argParsing from "./arg-parsing.ts";
import configuration from "./configuration.ts";
import completion from "./completion.ts";
import banners from "./banners.ts";
import image from "./image.ts";
import interruption from "./interruption.ts";

const demo: GroupCommand = {
  name: "demo",
  description: "Demonstration commands for dynamic-cli-framework features",
  memberSubCommands: [
    printing,
    prompting,
    argParsing,
    configuration,
    completion,
    banners,
    image,
    interruption,
  ],
  execute: async (_context: Context): Promise<void> => {},
};

export default demo;
