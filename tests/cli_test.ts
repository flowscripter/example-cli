import { assertRejects } from "@std/assert";
import { cli } from "../src/cli.ts";

Deno.test("CLI Test", async () => {
  await assertRejects(
    () => cli(import.meta.url),
    "Test case attempted to exit with exit code: 2",
  );
  Deno.exitCode = 0;
});
