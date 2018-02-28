import parser from "./parser";
import {
  testTemplate,
  testFileTemplate,
  namedModTemplate,
  defaultTemplate
} from "./templates";

export const generateTest = (contents = "", typeSystem) => {
  const mods = parser({ contents, srcFileName: undefined, typeSystem });
  return mods ? testTemplate(mods) : "";
};

export const generateTestTemplate = ({
  contents = "",
  srcFileName = "",
  importFromPath,
  typeSystem
} = {}) => {
  const mods = parser({ contents, srcFileName, typeSystem });
  if (mods) {
    const { namedMods, defaultMod } = mods;
    const areNameMods = (mods = []) => mods.length > 0;
    const fileDetails = { srcFileName, importFromPath };
    //Template Gen if default and named exist in file.
    if (defaultMod && areNameMods(namedMods)) {
      return testFileTemplate({ defaultMod, namedMods }, fileDetails);
    }
    if (defaultMod) {
      return defaultTemplate(defaultMod, fileDetails);
    }
    if (areNameMods(namedMods)) {
      return namedModTemplate(namedMods, fileDetails);
    }
  }
  return "";
};
