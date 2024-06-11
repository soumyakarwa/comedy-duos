// constants.js

// PROCESSING FUNCTIONS
/**
 * Extracts CSS Root Variables
 * @param {*} variable
 * @returns
 */
export const getCSSVariable = (variable) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
};

/**
 * Converts time to milliseconds
 * @param {} timeString
 * @returns
 */
const convertToMilliseconds = (timeString) => {
  if (timeString.endsWith("ms")) {
    return parseFloat(timeString);
  } else if (timeString.endsWith("s")) {
    return parseFloat(timeString) * 1000;
  } else {
    throw new Error("Unsupported time unit");
  }
};

// COLORS
export const yellowColor = getCSSVariable("--yellow");
export const blueColor = getCSSVariable("--blue");
export const pinkColor = getCSSVariable("--pink");
export const blackColor = getCSSVariable("--black");
export const whiteColor = getCSSVariable("--white");
export const colors = [yellowColor, blueColor, pinkColor];

// MISC
export const transitionTime = convertToMilliseconds(
  getCSSVariable("--transition-time")
);
