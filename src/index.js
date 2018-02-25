import parser from "./parser";
import {
  testTemplate,
  testFileTemplate,
  namedModTemplate,
  defaultTemplate
} from "./templates";

export const generateTest = (contents = "", typePreset) => {
  const mods = parser({ contents, srcFileName: undefined, typePreset });
  return mods ? testTemplate(mods) : "";
};

export const generateTestTemplate = ({
  contents = "",
  srcFileName = "",
  importFromPath,
  typePreset
} = {}) => {
  const mods = parser({ contents, srcFileName, typePreset });
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
