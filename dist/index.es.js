import { transform } from 'babel-core';
import prettier from 'prettier';

/**
 Purpose of this function is to use babel
 to parse the file and get all the export and default exports of a file.

 We should have a target object of what we want to work with
 Something like
 exportedFuncs = {
  defaultExport: {}, // here add info about a function which has a default export.
  namedExport: [], // array of named exports which contain info about the named exports
}
**/

const getDefaultName = (node = {}, defaultName = "defaultMod") => {
  if (node.declaration) {
    if (node.declaration.id) {
      return node.declaration.id.name;
    }
    return node.declaration.name || defaultName;
  }
  return defaultName;
};

const parser = (contents = "", srcFileName) => {
  const namedMods = [];
  let defaultMod;
  const getNodes = () => {
    return {
      visitor: {
        ExportNamedDeclaration(path) {
          if (path.node) {
            const { node } = path;
            if (node.declaration && node.declaration.id) {
              namedMods.push({
                type: node.type,
                declarationType: node.declaration.id.type,
                name: node.declaration.id.name
              });
            }
            if (node.declaration && node.declaration.declarations) {
              node.declaration.declarations.forEach(declaration => {
                namedMods.push({
                  type: node.type,
                  declarationType: declaration.id.type,
                  name: declaration.id.name
                });
              });
            }
            if (node.specifiers && node.specifiers.length >= 1) {
              node.specifiers.forEach(specifier => {
                namedMods.push({
                  type: node.type,
                  declarationType: specifier.exported.type,
                  name: specifier.exported.name
                });
              });
            }
          }
        },
        ExportDefaultDeclaration(path) {
          /**TODO: Investigate Identifer type**/
          if (path.node) {
            const { node } = path;
            defaultMod = {
              type: node.type,
              declarationType: node.declaration.type,
              name: getDefaultName(node, srcFileName)
            };
          }
        }
      }
    };
  };

  //Transform nodes via babel
  transform(contents, { plugins: [getNodes] });
  return { namedMods, defaultMod };
};

const spreadMods = (namedMods = [], defMod) => {
  return defMod ? [defMod, ...namedMods] : namedMods;
};

const generateTestCases = (mods = []) => {
  const initialTemplate = "";
  return mods.reduce((template, mod) => `${template} describe("${mod.name}", () => {
      it("should fail auto generated test", () => {
          expect(${mod.name}().toBe(false));
      });
    });`, initialTemplate);
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

const generateTest = (contents = "") => {
  const { namedMods, defaultMod } = parser(contents);
  return prettier.format(generateTestCases(spreadMods(namedMods, defaultMod)));
};

const generateTestTemplate = ({
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

export { generateTest, generateTestTemplate };
