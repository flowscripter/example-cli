import process from "node:process";
import { describe, expect, spyOn, test } from "bun:test";
import { cli } from "../src/cli.ts";

describe("ExampleCli Tests", () => {
  test("CLI Test", () => {
    const mockExit = spyOn(process, "exit").mockImplementation(() => {
      throw new Error("Mock exit");
    });

    expect(cli()).rejects.toThrow("Mock exit");

    expect(mockExit).toHaveBeenCalledWith(2);
    mockExit.mockRestore();
  });
});
