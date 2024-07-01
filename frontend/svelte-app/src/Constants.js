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

/**
 *
 * @param {*} marginVariable
 * @param {*} multiplier
 * @returns
 */
export function calculateMargin(marginVariable, multiplier) {
  // Extract the numerical part from the value (assuming the value is in "rem")
  const numericalValue = parseFloat(marginVariable);
  const result = numericalValue * multiplier;
  return `${result}rem`;
}

/**
 * Helper function to add two rem values
 * @param {string} rem1 - The first rem value (e.g., "1.5rem")
 * @param {string} rem2 - The second rem value (e.g., "2rem")
 * @returns {string} - The sum of the two rem values (e.g., "3.5rem")
 */
export function addRemValues(rem1, rem2) {
  const value1 = parseFloat(rem1);
  const value2 = parseFloat(rem2);
  const result = value1 + value2;
  return `${result}rem`;
}

export function remToPixels(rem) {
  const numericalValue = parseFloat(rem);
  return numericalValue * 16;
}

// COLORS
export const blackColor = getCSSVariable("--black");
export const whiteColor = getCSSVariable("--white");

export const blueColor = getCSSVariable("--blue");
export const yellowColor = getCSSVariable("--yellow");
export const purpleColor = getCSSVariable("--purple");
export const greenColor = getCSSVariable("--green");
export const orangeColor = getCSSVariable("--orange");

export const colors = [
  blueColor,
  yellowColor,
  purpleColor,
  greenColor,
  orangeColor,
];

// MISC
export const transitionTime = convertToMilliseconds(
  getCSSVariable("--transition-time")
);
export const titleFontSize = getCSSVariable("--title-font-size");
export const labelFontSize = getCSSVariable("--label-font-size");
export const margin = getCSSVariable("--margin");
export const ellipseSize = 7;
export const maxLineDelay = 750;

export const characterTextBoxX =
  parseFloat(getCSSVariable("--text-box-x")) / 100;
export const characterTextBoxY =
  parseFloat(getCSSVariable("--text-box-y")) / 100;
export const characterTextBoxHeight =
  parseFloat(getCSSVariable("--text-box-height")) / 100;
export const characterTextBoxWidth =
  parseFloat(getCSSVariable("--text-box-width")) / 100;

// SECTION TEXTS
export const standaloneText1 = [
  `To figure out the most iconic character duo, I first needed to figure out which characters were paired together. In order to do that I consolidated three different versions of the episode descriptions, text about what three different sources I used.`,
  `Second paragraph in some way about how I consolidated the three texts and analyzed the language to identify pairings.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut mauris ipsum. Pellentesque venenatis mollis metus, eu mattis sapien rhoncus ac. Nam arcu dolor, suscipit consequat tortor nec, condimentum aliquet eros. Nullam posuere vel mauris vitae tincidunt.`,
  `Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed nec lacus posuere justo porttitor consectetur id sed mi. Nulla dapibus dolor a ex viverra fringilla. Fusce facilisis ligula vel dui mattis posuere.`,
];
