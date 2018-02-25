import { transform } from "babel-core";
import reactPreset from "babel-preset-react";

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
  try {
    transform(contents, {
      presets: [reactPreset],
      plugins: [getNodes]
    });
    return { namedMods, defaultMod };
  } catch (err) {
    console.error("Trouble parsing contents via babel");
  }
};

export default parser;
