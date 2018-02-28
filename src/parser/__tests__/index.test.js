import parser from "../index";

import {
  reactSnippet,
  flowSnippet,
  typeScriptSnippet
} from "../../__tests__/testSnippets";
import { FLOW, TYPESCRIPT } from "../../constants";

const testFile = `
  export const someFunc = (x = 0) => x +1;
  const otherFunc = () => { console.log('some');}
  export class ClassName {}
  export default someModule;
`;

const noNameDefault = `export default function() {
  return "";
}`;

describe("parser", () => {
  it("should return an undefind and empty array when no params passed", () => {
    expect(parser()).toEqual({
      namedMods: [],
      defaultMod: undefined
    });
  });
  it("should populate namedMods array with named exports info & defaultMod with default mod info when found", () => {
    expect(parser({ contents: testFile })).toEqual({
      defaultMod: {
        declarationType: "Identifier",
        name: "someModule",
        type: "ExportDefaultDeclaration"
      },
      namedMods: [
        {
          declarationType: "Identifier",
          name: "someFunc",
          type: "ExportNamedDeclaration"
        },
        {
          declarationType: "Identifier",
          name: "ClassName",
          type: "ExportNamedDeclaration"
        }
      ]
    });
  });
  it("should return undefined and empty array when no exports found", () => {
    expect(parser({ contents: " const add1 = (x) => x + 1" })).toEqual({
      namedMods: [],
      defaultMod: undefined
    });
  });
  it("should name default module without a name to 'defaultMod' when no name declared", () => {
    expect(parser({ contents: noNameDefault }).defaultMod.name).toBe(
      "defaultMod"
    );
  });
  it("Should be able to parse react code", () => {
    expect(
      parser({
        contents: reactSnippet,
        srcFileName: undefined
      })
    ).toEqual({
      defaultMod: {
        declarationType: "Identifier",
        name: "RandomComponent",
        type: "ExportDefaultDeclaration"
      },
      namedMods: []
    });
  });
  it("Should be able to parse flow code if flow type system is specified", () => {
    expect(
      parser({
        contents: flowSnippet,
        srcFileName: undefined,
        typePreset: FLOW
      })
    ).toEqual({
      defaultMod: {
        declarationType: "Identifier",
        name: "addOne",
        type: "ExportDefaultDeclaration"
      },
      namedMods: []
    });
  });
  it("Should be able to parse typescript code if typescript type system is specified", () => {
    expect(
      parser({
        contents: typeScriptSnippet,
        srcFileName: undefined,
        typePreset: TYPESCRIPT
      })
    ).toEqual({
      defaultMod: undefined,
      namedMods: [
        {
          declarationType: "Identifier",
          name: "greeter",
          type: "ExportNamedDeclaration"
        }
      ]
    });
  });
});
