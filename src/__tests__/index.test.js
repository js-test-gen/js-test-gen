import { generateTest, generateTestTemplate } from "../index";
import {
  namedSnippet,
  defaultSnippet,
  testFileSnippet,
  reactSnippet,
  reactFunc,
  flowSnippet,
  flowFunc,
  typeScriptSnippet,
  typeScriptFunc
} from "../testSnippets";
import { FLOW, TYPESCRIPT } from "../constants/index";

const fileDetails = {
  srcFileName: "index",
  importFromPath: ".."
};

describe("generateTest", () => {
  it("should return an empty string if no params passed", () => {
    expect(generateTest()).toBe("");
  });
  it("should return an empty string if passed no js contents", () => {
    expect(generateTest("Invalid js contents")).toBe("");
  });
  it("should generateTest for js contents passed ", () => {
    expect(generateTest(namedSnippet)).toMatchSnapshot();
  });
  it("should generateTest test for flow contents passed ", () => {
    expect(generateTest(flowFunc, FLOW)).toMatchSnapshot();
  });
  it("should generateTest for test for react contents passed ", () => {
    expect(generateTest(reactFunc)).toMatchSnapshot();
  });
  it("should generateTest for typescript contents passed ", () => {
    expect(generateTest(typeScriptFunc, TYPESCRIPT)).toMatchSnapshot();
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
    ).toMatchSnapshot();
  });
  it("should return a named mod template if template contains no default mod", () => {
    expect(
      generateTestTemplate({
        contents: namedSnippet,
        ...fileDetails
      })
    ).toMatchSnapshot();
  });
  it("should return a default mod template if template contains no named mods", () => {
    expect(
      generateTestTemplate({
        contents: defaultSnippet,
        ...fileDetails
      })
    ).toMatchSnapshot();
  });
  it("should be able to generate a testTemplate for react code", () => {
    expect(
      generateTestTemplate({ contents: reactSnippet, ...fileDetails })
    ).toMatchSnapshot();
  });
  it("should be able to generate a testTemplate for code containing flow types", () => {
    expect(
      generateTestTemplate({
        contents: flowSnippet,
        ...fileDetails,
        typeSystem: FLOW
      })
    ).toMatchSnapshot();
  });
  it("should be able to generate a testTemplate for code containing typescript types", () => {
    expect(
      generateTestTemplate({
        contents: typeScriptSnippet,
        ...fileDetails,
        typeSystem: TYPESCRIPT
      })
    ).toMatchSnapshot();
  });
});
