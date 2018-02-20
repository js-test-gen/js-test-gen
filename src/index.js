import prettier from "prettier";
import parser from "./parser";

const spreadMods = (namedMods = [], defMod) => {
  return defMod ? [defMod, ...namedMods] : namedMods;
};

const generateTestCases = (mods = []) => {
  const initialTemplate = "";
  return mods.reduce(
    (template, mod) => `${template} describe("${mod.name}", () => {
      it("should fail auto generated test", () => {
          expect(${mod.name}().toBe(false));
      });
    });`,
    initialTemplate
  );
};

/**
 Purpose of this function is to return a string importing
 all the exported named modules like the following.
 "import {func1, func,2}"
**/
const generateNamedImports = (funcList = []) => {
  const endOfTheLine = funcList.length - 1;
  return funcList.reduce((exportStr, func, idx) => {
    if (idx === 0) {
      return `{ ${func.name},`;
    }
    if (idx === endOfTheLine) {
      return `${exportStr} ${func.name} }`;
    }
    return `${exportStr} ${func.name},`;
  }, "");
};

const generateDefaultImport = (defaultImport = "") => defaultImport;

const generateFromStatement = (fileName = "", fromPath) => {
  const location = fromPath || `./${fileName}`;
  return `from '${location}'`;
};

export const generateTest = (contents = "") => {
  const { namedMods, defaultMod } = parser(contents);
  return prettier.format(generateTestCases(spreadMods(namedMods, defaultMod)));
};

export const generateTestTemplate = ({
  contents = "",
  srcFileName = "",
  importFromPath
}) => {
  const { namedMods, defaultMod } = parser(contents, srcFileName);
  const areNameMods = (mods = []) => mods.length > 0;
  //Template Gen if default and named exist in file.
  if (defaultMod && areNameMods(namedMods)) {
    return prettier.format(`
      import ${generateDefaultImport(defaultMod.name)},
      ${generateNamedImports(namedMods)}
      ${generateFromStatement(srcFileName, importFromPath)}
      ${generateTestCases(spreadMods(namedMods, defaultMod))};
    `);
  }
  if (defaultMod) {
    return prettier.format(`
      import ${generateDefaultImport(defaultMod.name)}
      ${generateFromStatement(srcFileName, importFromPath)}
      ${generateTestCases([defaultMod])};
    `);
  }
  if (areNameMods(namedMods)) {
    return prettier.format(`
      import ${generateNamedImports(namedMods)}
      ${generateFromStatement(srcFileName, importFromPath)}
      ${generateTestCases(namedMods)};
    `);
  }
  return "";
};
