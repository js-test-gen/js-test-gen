import { transform } from "babel-core";

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

export default parser;
