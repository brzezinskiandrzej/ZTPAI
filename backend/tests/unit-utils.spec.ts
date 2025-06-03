import { isNumeric }  from "../src/utils/isNumeric";
import { isBoolean }  from "../src/utils/isBoolean";

describe("utils: isNumeric / isBoolean", () => {

  /* isNumeric */
  it("rozpoznaje liczby", () => {
    expect(isNumeric("123")).toBe(true);
    expect(isNumeric("0")).toBe(true);
  });
  it("odrzuca inne", () => {
    expect(isNumeric("a12")).toBe(false);
    expect(isNumeric("")).toBe(false);
  });

  /* isBoolean  – funkcja zwraca true tylko dla bool, nie stringów */
  it("rozpoznaje boolean literal", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });
  it("odrzuca inne", () => {
    expect(isBoolean("true")).toBe(false);
    expect(isBoolean(null)).toBe(false);
  });
});
