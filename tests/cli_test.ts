import { assertRejects } from "@std/assert";
import { cli } from "../src/cli.ts";

Deno.test("CLI Test", () => {
  assertRejects(() => cli(import.meta.url), Error, "Test case attempted to exit with exit code: 2");
});
