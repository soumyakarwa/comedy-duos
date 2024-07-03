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
export const standaloneIntroduction = [
  `Golden Globe winner Brooklyn Nine-Nine is a situational comedy show about the detectives of Brooklyn’s 99th Precinct when a rule-following, outwardly unemotional, and highly decorated NYPD Captain Raymond Holt (played by Andre Braugher) takes charge. Under new leadership, the offbeat albeit talented detectives must get their act together–some more happily than others.`,
  `Like in most sitcoms, each Brooklyn Nine-Nine episode presents a self-contained story that contributes to the overall growth of characters and their relationships. Consequently, what makes Brooklyn Nine-Nine so unique isn’t the part where they bust the bad guys but rather about the people doing the busting! It’s about how their lives, relationships, and ambitions change as a result of their experiences on the job and their interactions with each other. But set against a grim backdrop of a police precinct where things don’t usually go as planned, Brooklyn Nine-Nine reminds its viewers that with the right people by our side and a sense of humor, we can handle anything!`,
];

export const standaloneText1 = [
  `To figure out the most iconic character duo, I first needed to figure out which characters were paired together. In order to do that I consolidated three different versions of the episode descriptions, text about what three different sources I used.`,
  `Second paragraph in some way about how I consolidated the three texts and analyzed the language to identify pairings.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut mauris ipsum. Pellentesque venenatis mollis metus, eu mattis sapien rhoncus ac. Nam arcu dolor, suscipit consequat tortor nec, condimentum aliquet eros. Nullam posuere vel mauris vitae tincidunt.`,
  `Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed nec lacus posuere justo porttitor consectetur id sed mi. Nulla dapibus dolor a ex viverra fringilla. Fusce facilisis ligula vel dui mattis posuere.`,
];

export const characterSectionText = [
  `Whether it’s Jake & Amy navigating their feelings for each other against all odds, Captain Holt & Jake developing mutual respect despite being complete opposites, or Charles & Rosa’s strange but strong dynamic, I was intrigued by these unlikely duos. I wanted to delve deeper into the character relationships and, just for fun, analyze which character duo is the most popular and most loved! But before I jump into my analysis, let me introduce the beloved Brooklyn Nine-Nine characters!`,
  `Captain Raymond Holt is known for his unwavering dedication, dry wit, and calm demeanor. Despite his outwardly unemotional facade, Holt deeply cares for his team, bringing order and unexpected humor to their daily lives. Being the first openly Black Gay Police officer in the NYPD, Captain Holt has fought many tough battles. However, bringing the carefree, talented, but irresponsible Detective Jacob Peralta (played by Andy Samberg) in line might be one of the most brutal battles yet.`,
  `Detective Jacob "Jake" Peralta, the talented yet immature detective of Brooklyn's 99th Precinct, is known for his reckless behavior and unwavering confidence. He often neglects responsibility and enjoys pranks, but his natural detective skills and charm make him an invaluable, if unpredictable, member of the team. Over time, Jake's character grows significantly, primarily through his relationship with Detective Amy Santiago, where he learns responsibility, maturity, and the value of teamwork and commitment.`,
  `Detective Amy Santiago is the fiercely competitive, highly organized, and detail-oriented detective of Brooklyn's 99th Precinct. Known for her unwavering ambition and obsession with rules, Amy strives for perfection in everything she does, from her meticulously organized binders to her quest to become the youngest captain in NYPD history. Her dedication and efficiency make her an indispensable asset to the team, though her intense focus on her career sometimes leads to humorous and endearing quirks. `,
  `Sergeant Terry Jeffords is the brawny yet tender-hearted sergeant of Brooklyn's 99th Precinct. While he is known for his immense strength and imposing physique, he also has a heart of gold and is a self-declared family man. Terry strives to keep the detective squad in line, help with cases, and care for them when sick or injured. Though he can be tough and skeptical of the precinct shenanigans, he knows how to have fun and relax and allows himself to indulge in life's little pleasures, like his beloved yogurt.`,
  `Gina Linetti, the eccentric and hilariously self-absorbed civilian administrator, is known for her unique brand of sarcasm, unmatched confidence, and penchant for the dramatic. With a personality as bold as her fashion choices, Gina often steals the spotlight with her biting humor and unapologetic self-assurance. Despite her seemingly aloof attitude, Gina is undeniably loyal to her friends and colleagues, often offering surprisingly profound insights and unwavering support when they least expect it. `,
  `Detective Charles Boyle is the devoted, kind-hearted, and incredibly quirky detective of Brooklyn's 99th Precinct. Known for his loyalty and admiration for his best friend, Jake, Charles often goes all out to support his colleagues, even if it means putting himself in awkward situations. His culinary expertise, particularly his love for exotic foods adds an endearing dimension to his character. Though often perceived as a pushover due to his earnestness, Charles' dedication to his work and friends is unquestionable.`,
  `Detective Rosa Diaz is tough-as-nails and known for her intense demeanor and mysterious past. With a no-nonsense attitude and a penchant for maintaining a highly private personal life, Rosa keeps her colleagues at arm's length. However, beneath her stoic exterior, Rosa harbors a surprising depth of compassion, often revealing her softer side in moments of vulnerability. Her dark humor and unexpected interests, such as classical ballet and motorcycling, add layers to her complex and intriguing personality.`,
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
