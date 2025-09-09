import { describe, it, expect } from "vitest";
import { getErrorMessage } from "./helpers";

describe("getErrorMessage", () => {
  it("should return message if err is an Error instance", () => {
    const err = new Error("Something went wrong");
    expect(getErrorMessage(err)).toBe("Something went wrong");
  });

  it("should return stringified value if err is a string", () => {
    expect(getErrorMessage("Oops")).toBe("Oops");
  });

  it("should return stringified value if err is a number", () => {
    expect(getErrorMessage(404)).toBe("404");
  });

  it("should return stringified value if err is null", () => {
    expect(getErrorMessage(null)).toBe("null");
  });

  it("should return stringified value if err is an object", () => {
    const obj = { code: 500 };
    expect(getErrorMessage(obj)).toBe("[object Object]");
  });
});
