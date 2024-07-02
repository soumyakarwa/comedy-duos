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

export function convertViewportUnits(value) {
  // Check if the value is a string and ends with 'vh' or 'vw'
  if (
    typeof value !== "string" ||
    (!value.endsWith("vh") && !value.endsWith("vw"))
  ) {
    throw new Error('Value must be a string ending with "vh" or "vw".');
  }

  // Get the numeric part of the value
  const numericValue = parseFloat(value);

  // Get the unit (vh or vw)
  const unit = value.slice(-2);

  // Calculate the conversion based on the unit
  let convertedValue;
  if (unit === "vh") {
    convertedValue = numericValue * (window.innerHeight / 100);
  } else if (unit === "vw") {
    convertedValue = numericValue * (window.innerWidth / 100);
  }

  return convertedValue;
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

export const characterSectionText = [
  `If you don’t already know what Brooklyn Nine–Nine is (which is borderline ridiculous btw), let me bring you up to speed on one of the most iconic sitcoms of our time. A Golden Globe winner, Brooklyn Nine–Nine is a 2013–2021 workplace sitcom about Brooklyn’s 99th Precinct’s detective squad when a rule-following, outwardly-unemotional, highly decorated NYPD <span class="yellow">Captain Raymond Holt</span> (played by Andre Braugher) takes over.`,
  `Being the first openly Black Gay Police officer in the NYPD, Captain Holt has fought many uphill battles; but bringing the carefree, talented, almost irresponsible Detective Jacob Peralta (played by Andy Samberg) in line, might just be the toughest battle yet (lol I kid ofcourse).`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus commodo placerat. Cras vehicula purus non eros laoreet ultrices. Suspendisse congue bibendum dolor, non eleifend nunc ullamcorper sed. Praesent pulvinar ullamcorper malesuada. Proin scelerisque purus sed nibh vulputate ultrices. Nunc vitae ullamcorper sapien, sit amet sollicitudin quam. Orci varius natoque.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus commodo placerat. Cras vehicula purus non eros laoreet ultrices. Suspendisse congue bibendum dolor, non eleifend nunc ullamcorper sed. Praesent pulvinar ullamcorper malesuada. Proin scelerisque purus sed nibh vulputate ultrices. Nunc vitae ullamcorper sapien, sit amet sollicitudin quam. Orci varius natoque.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus commodo placerat. Cras vehicula purus non eros laoreet ultrices. Suspendisse congue bibendum dolor, non eleifend nunc ullamcorper sed. Praesent pulvinar ullamcorper malesuada. Proin scelerisque purus sed nibh vulputate ultrices. Nunc vitae ullamcorper sapien, sit amet sollicitudin quam. Orci varius natoque.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus commodo placerat. Cras vehicula purus non eros laoreet ultrices. Suspendisse congue bibendum dolor, non eleifend nunc ullamcorper sed. Praesent pulvinar ullamcorper malesuada. Proin scelerisque purus sed nibh vulputate ultrices. Nunc vitae ullamcorper sapien, sit amet sollicitudin quam. Orci varius natoque.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus commodo placerat. Cras vehicula purus non eros laoreet ultrices. Suspendisse congue bibendum dolor, non eleifend nunc ullamcorper sed. Praesent pulvinar ullamcorper malesuada. Proin scelerisque purus sed nibh vulputate ultrices. Nunc vitae ullamcorper sapien, sit amet sollicitudin quam. Orci varius natoque.`,
];

export const heatMapSectionText = [
  `Continuing from previous analysis.`,
  `In the previous section we analysed Season 3, Episode 6, "Into the woods". Let's put the anlaysis onto a grid.`,
  `Conducting the same analysis for all episodes.`,
  `To streamline, let’s consider pairs with top 10% pairings together.`,
  `Now, there are two ways of finding the most iconic duo. The easiest, is to see which pair got the most screentime.`,
  `To no one's surprise, we can see that the pair with the most appearences together iss DUN DUN DUN Jake & Amy.`,
  `In another approach, (perhaps more accurate) let's account for the number of votes and average rating of each episode to calculate the average cummilative rating.`,
  `And evidently, despite having lesser screentime, the most iconic duo of Brooklyn Nine-Nine is CAPTAIN HOLT & JAKE! They've appeared together 36 times, with over ____ votes and an average episode rating of 8.26. The viewers have spoken!`,
];

export const episodeBreakdownText = [
  `Let's consider this square to represent an episode.`,
  `Using three different descriptions provided me more insight, and allowed me to compare and contrast the plots for each episode.`,
  `Breaking the descriptions down to sentences provides insight about the different plot points.`,
  `Breaking down complicated sentences into clauses to improve analysis.`,
  `Analysing each part for character groups or pairings.`,
  `Comparing the descriptions to identify distinct groups. For instance, all three descriptions contain a distinct group of Jake, Charles and Terry.`,
  `Now it gets interesting. Description 1 is just one long sentence, but Description 3 is comprehensible and divided. I used Description 3 to correspond and break-up larger groups in Descriptions 1 & 2. So we know the second pair is, Captain Holt & Rosa.`,
  `And lastly, we have the unlikely duo of Amy & Gina! And so we know the groupings in __ episode. The next step, is to carry this out for all episodes of all seasons!`,
];
