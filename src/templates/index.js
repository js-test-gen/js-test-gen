import prettier from "prettier";

export const spreadMods = (namedMods = [], defMod) => {
  return defMod ? [defMod, ...namedMods] : namedMods;
};

const cleanName = (str = "") => str.replace(new RegExp("-", "g"), "");

export const generateTestCases = (mods = []) => {
  const initialTemplate = "";
  return mods.reduce(
    (template, mod) => `${template} describe("${mod.name}", () => {
      it("should fail auto generated test", () => {
          expect(${cleanName(mod.name)}()).toBe(false);
      });
    });`,
    initialTemplate
  );
};

export const generateNamedImports = (funcList = []) => {
  const namedImports = funcList.reduce((exportStr, func) => {
    return `${exportStr} ${func.name},`;
  }, "{");
  const removeLastComma = str => {
    return str.slice(0, str.length - 1);
  };
  // namedImports will be "{" if reducing over empty array
  return namedImports.length > 1 ? `${removeLastComma(namedImports)} }` : "";
};

export const generateDefaultImport = (defaultImport = "") =>
  cleanName(defaultImport);

export const generateFromStatement = (fileName = "", fromPath) => {
  const location = fromPath || `./${fileName}`;
  return `from '${location}'`;
};

export const testFileTemplate = (
  { defaultMod, namedMods },
  { srcFileName, importFromPath }
) => {
  return prettier.format(`
    import ${generateDefaultImport(defaultMod.name)},
    ${generateNamedImports(namedMods)}
    ${generateFromStatement(srcFileName, importFromPath)}
    ${generateTestCases(spreadMods(namedMods, defaultMod))};
  `);
};

export const namedModTemplate = (
  namedMods,
  { srcFileName, importFromPath }
) => {
  return prettier.format(`
    import ${generateNamedImports(namedMods)}
    ${generateFromStatement(srcFileName, importFromPath)}
    ${generateTestCases(namedMods)};
  `);
};

export const defaultTemplate = (
  defaultMod,
  { srcFileName, importFromPath }
) => {
  return prettier.format(`
    import ${generateDefaultImport(defaultMod.name)}
    ${generateFromStatement(srcFileName, importFromPath)}
    ${generateTestCases([defaultMod])};
  `);
};

export const testTemplate = ({ defaultMod, namedMods }) => {
  return prettier.format(generateTestCases(spreadMods(namedMods, defaultMod)));
};
