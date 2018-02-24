import prettier from "prettier";
import parser from "./parser";
import {
  spreadMods,
  generateTestCases,
  generateNamedImports,
  generateDefaultImport,
  generateFromStatement
} from "./utils";

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
