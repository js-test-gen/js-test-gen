import prettier from "prettier";
import {
  spreadMods,
  generateTestCases,
  generateNamedImports,
  generateDefaultImport,
  generateFromStatement
} from "../index";
describe("spreadMods", () => {
  it("should combine default and named mods into one array", () => {
    expect(spreadMods([1, 3, 4], 5)).toEqual([5, 1, 3, 4]);
  });
  it("should return 'namedMods' param if no defaultMod param passed", () => {
    expect(spreadMods([1, 3, 4])).toEqual([1, 3, 4]);
  });
  it("should return 'defaultMod' param wrapped in array if 'namedMods' param not defined", () => {
    expect(spreadMods(undefined, 2)).toEqual([2]);
  });
});
describe("generateTestCases", () => {
  it("should return an empty string if 'namedMods' param is not defined", () => {
    expect(generateTestCases()).toBe("");
  });
  it("should generate a test case per module", () => {
    expect(
      prettier.format(generateTestCases([{ name: "mod1" }, { name: "mod2" }]))
    ).toMatchSnapshot();
  });
  it("should generate test cases when module contains '-'", () => {
    expect(
      prettier.format(
        generateTestCases([{ name: "mod1" }, { name: "mod-two" }])
      )
    ).toMatchSnapshot();
  });
});
describe("generateNamedImports", () => {
  it("should return empty string if 'funcList' param is not defined", () => {
    expect(generateNamedImports()).toBe("");
  });
  it("should return namedImports wrapped in currly braces", () => {
    expect(generateNamedImports([{ name: "someExport" }])).toBe(
      "{ someExport }"
    );
    expect(
      generateNamedImports([
        { name: "someExport" },
        { name: "someMod" },
        { name: "otherMod" }
      ])
    ).toBe("{ someExport, someMod, otherMod }");
  });
});
describe("generateDefaultImport", () => {
  it("should return an empty string if called with no params", () => {
    expect(generateDefaultImport()).toBe("");
  });
  it("should return the param passed", () => {
    expect(generateDefaultImport("someVal")).toBe("someVal");
  });
  it("should be able to handle translate " - " to epmty spaces", () => {
    expect(generateDefaultImport("some-val")).toBe("someval");
  });
});
describe("generateFromStatement", () => {
  it("should get file from current dir if filePath is not defined'", () => {
    expect(generateFromStatement("someFile")).toBe("from './someFile'");
  });
  it("should return path as current dir if no params passed", () => {
    expect(generateFromStatement()).toBe("from './'");
  });
  it("should include filePath and fileName if the are defined'", () => {
    expect(generateFromStatement("someFile", "../someFile")).toBe(
      "from '../someFile'"
    );
  });
});
