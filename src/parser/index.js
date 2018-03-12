import { transform } from "@babel/core";
import reactPreset from "@babel/preset-react";
import typescriptPreset from "@babel/preset-typescript";
import flowPreset from "@babel/preset-flow";

import { FLOW, TYPESCRIPT } from "../constants";

const getTypePreset = typePreset => {
  if (typePreset === FLOW) {
    return flowPreset;
  }
  if (typePreset === TYPESCRIPT) {
    return typescriptPreset;
  }
  return {};
};

const getDefaultName = (node = {}, defaultName = "defaultMod") => {
  if (node.declaration) {
    if (node.declaration.id) {
      return node.declaration.id.name;
    }
    return node.declaration.name || defaultName;
  }
  return defaultName;
};

const parser = ({ contents = "", srcFileName, typeSystem } = {}) => {
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
          if (path.node) {
            const { node } = path;
            defaultMod = {
              type: node.type,
              declarationType: node.declaration.type,
              name: getDefaultName(node, srcFileName)
            };
          }
        },
        MemberExpression(path) {
          if (
            path.get("object").isIdentifier({ name: "module" }) &&
            path.get("property").isIdentifier({ name: "exports" })
          ) {
            defaultMod = {
              type: "MemberExpression",
              declarationType: "ModuleExports",
              name: srcFileName || "exportedModule"
            };
          }
        }
      }
    };
  };

  //Transform nodes via babel
  try {
    transform(contents, {
      presets: [getTypePreset(typeSystem), reactPreset],
      plugins: [getNodes]
    });
    return { namedMods, defaultMod };
  } catch (err) {
    console.error("Trouble parsing contents via babel");
  }
};

export default parser;
