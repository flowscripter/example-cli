import { describe, expect, test } from "bun:test";
import { cli } from "../src/cli.ts";

describe("ExampleCli Tests", () => {
  test("CLI Test", async () => {
  await expect(
    () => cli(import.meta.url)).rejects.toThrow(
    "Test case attempted to exit with exit code: 2",
  );
  process.exitCode = 0;
});
});
