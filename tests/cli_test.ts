import { assertEquals } from "@std/assert";
import { cli } from "../src/cli.ts";

Deno.test("CLI Test", async () => {
  try {
    await cli(import.meta.url);
  } catch (err) {
    // expected error: exit code 2 is NO_COMMAND
    assertEquals(
      (err as Error).message,
      "Test case attempted to exit with exit code: 2",
    );
  }
});
