import parser from "../index";

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
  it("should return an empty default obj and empty array when no params passed", () => {
    expect(parser()).toEqual({
      namedMods: [],
      defaultMod: {
        type: "",
        declarationType: "",
        name: ""
      }
    });
  });
  it("should populate namedMods array with named exports info & defaultMod with default mod info when found", () => {
    expect(parser(testFile)).toEqual({
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
  it("should return an empty default obj and empty array when no exports found", () => {
    expect(parser(" const add1 = (x) => x + 1")).toEqual({
      namedMods: [],
      defaultMod: {
        type: "",
        declarationType: "",
        name: ""
      }
    });
  });
  it("should name default module without a name to 'defaultMod' when no name declared", () => {
    expect(parser(noNameDefault).defaultMod.name).toBe("defaultMod");
  });
});
