export const spreadMods = (namedMods = [], defMod) => {
  return defMod ? [defMod, ...namedMods] : namedMods;
};

export const generateTestCases = (mods = []) => {
  const initialTemplate = "";
  return mods.reduce(
    (template, mod) => `${template} describe("${mod.name}", () => {
      it("should fail auto generated test", () => {
          expect(${mod.name}()).toBe(false);
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

export const generateDefaultImport = (defaultImport = "") => defaultImport;

export const generateFromStatement = (fileName = "", fromPath) => {
  const location = fromPath || `./${fileName}`;
  return `from '${location}'`;
};
