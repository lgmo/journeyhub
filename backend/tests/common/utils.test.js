import { describe, it, expect } from "@jest/globals";
import { getUTCDate } from "../../src/common/utils.js";

describe("utils", () => {
  describe("getUTCDate", () => {
    it("should return the UTC date", () => {
      const date = "2000-01-01T00:00:00.000Z";
      const utcDate = getUTCDate(date);
      expect(utcDate.toISOString()).toEqual(date);
    });
  });
});
