import prettier from "prettier";
import { generateTest, generateTestTemplate } from "../index";
import {
  generateTestCases,
  testFileTemplate,
  namedModTemplate,
  defaultTemplate
} from "../templates";

const fileDetails = {
  srcFileName: "index",
  importFromPath: ".."
};
const namedSnippet = "export const add1 = (x) => x + 1";
const defaultSnippet = `
const obj = {};
export default obj`;
const testFileSnippet = `
${namedSnippet} 
${defaultSnippet}`;

describe("generateTest", () => {
  it("should return an empty string if no params passed", () => {
    expect(generateTest()).toBe("");
  });
  it("should return an empty string if passed no js contents", () => {
    expect(generateTest("Invalid js contents")).toBe("");
  });
  it("should return an empty string if passed no js contents ", () => {
    const result = prettier.format(generateTestCases([{ name: "add1" }]));
    expect(generateTest(namedSnippet)).toBe(result);
  });
});
describe("generateTestTemplate", () => {
  it("should return an empty string if no params passed", () => {
    expect(generateTestTemplate()).toBe("");
  });
  it("should return an empty string if passed no js contents", () => {
    expect(generateTestTemplate("Invalid js contents")).toBe("");
  });
  it("should return a test file template if js contents contains default & named mods", () => {
    expect(
      generateTestTemplate({
        contents: testFileSnippet,
        ...fileDetails
      })
    ).toBe(
      testFileTemplate(
        { defaultMod: { name: "obj" }, namedMods: [{ name: "add1" }] },
        fileDetails
      )
    );
  });
  it("should return a named mod template if template contains no default mod", () => {
    expect(
      generateTestTemplate({
        contents: namedSnippet,
        ...fileDetails
      })
    ).toBe(namedModTemplate([{ name: "add1" }], fileDetails));
  });
  it("should return a default mod template if template contains no named mods", () => {
    expect(
      generateTestTemplate({
        contents: defaultSnippet,
        ...fileDetails
      })
    ).toBe(defaultTemplate({ name: "obj" }, fileDetails));
  });
});
