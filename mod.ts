import { cli } from "./src/cli.ts";

import packageInfo from "./deno.json" with { type: "json" };

await cli(packageInfo.version);
