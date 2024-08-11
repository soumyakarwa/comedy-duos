// constants.js

// PROCESSING FUNCTIONS

/**
 * Converts a hex color code to an RGB color code and adds a desired alpha value.
 * @param {string} hex - The hex color code (e.g., '#ff5733' or 'ff5733').
 * @param {number} alpha - The alpha value (between 0 and 1).
 * @returns {string} The RGBA color code (e.g., 'rgba(255, 87, 51, 0.5)').
 */
export function hexToRGBA(hex, alpha) {
  // Remove the leading '#' if it's present
  hex = hex.replace(/^#/, "");

  // Parse the hex color code
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Ensure alpha is between 0 and 1
  alpha = Math.min(1, Math.max(0, alpha));

  // Return the RGBA color code
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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

export const lightBlueColor = getCSSVariable("--light-blue");
export const lightYellowColor = getCSSVariable("--light-yellow");
export const lightPurpleColor = getCSSVariable("--light-purple");
export const lightGreenColor = getCSSVariable("--light-green");
export const lightOrangeColor = getCSSVariable("--light-orange");

export const colors = [
  lightBlueColor,
  lightGreenColor,
  lightPurpleColor,
  lightYellowColor,
  lightOrangeColor,
];

export const heatMapColors = [
  blueColor,
  greenColor,
  purpleColor,
  yellowColor,
  orangeColor,
  lightBlueColor,
  lightGreenColor,
  lightPurpleColor,
  lightYellowColor,
  lightOrangeColor,
];

// export const accentColor = ["#005393", ];

// MISC
// export const transitionTime = (function () {
//   const time = convertToMilliseconds(getCSSVariable("--transition-time"));
//   return time !== null && !isNaN(time) ? time : 750;
// })();
export const transitionTime = 750;
export const titleFontSize = getCSSVariable("--title-font-size");
export const labelFontSize = getCSSVariable("--label-font-size");
export const margin = getCSSVariable("--margin");
export const maxLineDelay = 750;

// export const ellipseSize = remToPixels(getCSSVariable("--thumb-pin"));
export const tabletSize = 768;
export const mobileSize = 480;

export const ellipseSize = window.innerWidth > tabletSize ? 6 : 5;

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
  `Golden Globe winner Brooklyn Nine-Nine is a situational comedy show about the detectives of Brooklyn's 99th Precinct when a rule-following, outwardly unemotional, and highly decorated NYPD Captain Raymond Holt takes charge. Under new leadership, the offbeat albeit talented detectives must get their act together–some more happily than others.`,
  `Like most sitcoms, each Brooklyn Nine-Nine episode presents a self-contained story contributing to character development and relationship dynamics. Consequently, what makes Brooklyn Nine-Nine so unique isn't the part where they bust the bad guys but rather about the people doing the busting! And set against a grim backdrop of a police precinct where things don't usually go as planned, Brooklyn Nine-Nine reminds us that with the right people by our side and a sense of humor, we can handle anything!`,
];

export const characterSectionText = [
  `Brooklyn Nine-Nine features a cast of beloved characters with unique dynamics. Whether it's Jake and Amy navigating their complicated romantic feelings, Captain Holt and Jake finding harmony in their contrasting personalities, or Charles and Rosa having an eccentric but solid friendship, these character relationships are fascinating and set the stage for an analysis to determine the most popular and loved character duo!`,
  `Hover 👆🏻 on each character to find out more or arrow-right ➡️ get straight into the analysis!`,
  `Captain Raymond Holt is a dedicated and calm leader who, despite his unemotional facade, deeply cares for his team. As the first openly Black gay police officer in the NYPD, he has faced many challenges. However, managing the carefree, talented, yet irresponsible Detective Jake Peralta might be his toughest battle.`,
  `Detective Jacob "Jake" Peralta is a talented yet immature detective known for his reckless behavior and unwavering confidence. Though he often shirks responsibility and enjoys pranks, his natural detective skills and charm make him an invaluable, if unpredictable, team member.`,
  `Detective Amy Santiago is fiercely competitive, highly organized, and detail-oriented. Ambitious and obsessed with rules, she strives for perfection in everything, from her organized binders to her goal of becoming the youngest NYPD captain. Her dedication and efficiency make her indispensable to the team, though her intense career focus leads to humorous and endearing quirks.`,
  `Sergeant Terry Jeffords is a strong yet compassionate sergeant known for his immense strength and imposing physique. He also has a heart of gold and is devoted to his family. Terry strives to maintain order, assist with cases, and care for his squad. Despite his tough exterior and skepticism towards precinct antics, he knows how to have fun and enjoy life's pleasures, such as his beloved yogurt.`,
  `Gina Linetti, the eccentric civilian administrator, is known for her unique sarcasm, unmatched confidence, and dramatic flair. Her bold personality and fashion choices often steal the spotlight with biting humor and unapologetic self-assurance. Despite her aloof demeanor, Gina is loyal to her friends and colleagues and unexpectedly provides profound insights.`,
  `Detective Charles Boyle is known for his devotion, kindness, and quirky personality. He is loyal and supportive, especially towards his best friend, Jake, and often puts himself in awkward situations for his colleagues. His love for exotic foods and culinary expertise add to his endearing nature. Despite being seen as a pushover, Charles' dedication to his work and friends is unquestionable.`,
  `Detective Rosa Diaz is known for her intense demeanor, mysterious past, and no-nonsense attitude. She keeps her personal life private and colleagues at a distance. However, despite her stoic exterior, she shows surprising compassion and vulnerability. Rosa's dark humor and interests in classical ballet and motorcycling add complexity to her intriguing personality.`,
];

export const standaloneText1 = [
  `To identify Brooklyn Nine-Nine's most iconic duo, I analyzed each episode’s episode descriptions to pinpoint which characters have been grouped together. Some of the more obvious ones are Jake and Captain Holt or Jake and Amy, but there have been top-rated episodes with Charles and Amy paired together or even Terry and Rosa! The question is, how many episodes are these character duos paired together in, and how popular was the episode?`,
  `<span class="italic">Methodology</span>`,
  `I used a dataset of IMDb ratings and votes for all 153 episodes, which also included information like title, airdate, season number, episode number, official description, etc. I scraped two more episode description datasets from Wikipedia and WikiFandom to improve the accuracy of the analysis. Using the Natural Language Toolkit and OpenAI API, I broke every description down into different plot points and, consequently, different character groups.`,
  `Then, I calculated the average IMDb rating for all identified character duos. That was a lot of words, but let me break down my analysis with an example–Season 3, Episode 4, "The Oolong Slayer."`,
];

export const episodeBreakdownText = [
  `Consider this square <span class="square"></span> to represent character groups from Season 3, Episode 4, "The Oolong Slayer."`,
  `I used three different episode descriptions (Official, Wiki Fandom and Wikipedia respectively) to strengthen the language analysis by allowing for comparison in case of an error.`,
  `Using the Natural Language Toolkit, I broke down each description into sentences to identify different plot points. By comparing the three descriptions, we know that <span class="highlighted" style="background-color: var(--light-blue)">Jake & Captain Holt</span> are secretly working a case together.`,
  `Then, using the OpenAI API, I further broke down complicated sentences into independent clauses. For instance, in <span class="italic">Wikipedia Description</span> we know that <span class="highlighted" style="background-color: var(--light-purple)">Amy and Rosa</span> have a different plot point than <span class="highlighted" style="background-color: var(--light-yellow)">Charles and Terry</span> even though they are all grouped together in one sentence.`,
  `Next, I checked the identified plot points (highlighted) against the list of characters to identify all distinct character groups.`,
  `Then, I compared the three descriptions to ensure a character group existed independently in each. For instance, all three descriptions contain a distinct plot point describing <span class="highlighted" style="background-color: rgb(82, 180, 255, 0.3); color: var(--blue)">Jake and Captain Holt’s</span> secret case!`,
  `Here's where it gets interesting. I compared all the descriptions to correspond and break up larger character groups. Comparing the plot points and sentence structure of the<span class="italic">Official Description</span> and the <span class="italic">Wikipedia Description</span> against the<span class="italic">Wikifandom Description</span> helped confirm another pair: <span class="highlighted" style="background-color: rgb(142, 208, 0, 0.3); color: var(--green)">Rosa, Amy</span> while they were planning The Vulture’s party (ew)!`,
  `Last but not least, we have <span class="highlighted" style="background-color: rgb(163, 102, 255, 0.3); color: var(--purple)">Charles and Terry</span>! Using this method, I identified the groupings in "The Oolong Slayer" and subsequently for all 153 episodes.`,
];

export const heatMapSectionText = [
  ``,
  `As concluded from the previous section, Season 3, Episode 4, "The Oolong Slayer" had three distinct character groups. `,
  `After analyzing all episodes, I found that each one had up to five distinct character pairings.`,
  `To streamline the analysis, I filtered the dataset for the top 10 most frequently occurring character duos.`,
  `Now, one way to measure a character duo's popularity is by counting how often they appear together in the series, that is, frequency.`,
  `In the bar chart below, it's clear that the most frequently appearing character duo is none other than Jake & Amy. However, is this the only way to measure popularity?`,
  `Another, perhaps more accurate, way to measure a duo's popularity is to calculate the average rating of each episode they appeared in, accounting for the number of votes that episode received, which would give us the cumulative average rating.`,
  `And there we have it! Despite having less screen time, the most iconic duo of Brooklyn Nine-Nine is Captain Holt & Jake! They've appeared together 36 times, with over 97,737 votes and an average episode rating of 8.47/10. The viewers have spoken! Sorry, Amy, it seems like you lost this one!`,
  `Here's to Captain Holt & Jake!`,
];

export const standaloneConclusion = [
  // `After a meticulous analysis of 153 episodes, taking into account both the frequency of appearances and episode ratings, it is clear that the most iconic duo of Brooklyn Nine-Nine are Captain Holt and Detective Jake Peralta. Despite their contrasting personalities and initial friction, their relationship evolves into one of mutual respect, camaraderie, and heartfelt moments that resonate deeply with the audience. Their 36 appearances together, with an impressive average IMDb rating of 8.47, solidify their status as the viewers' favorite pair.`,
  `Brooklyn Nine-Nine not only provides laughs but also explores themes of friendship, loyalty, and growth, reminding us that no matter how different we may seem, we can always find common ground and support each other. As the Precinct's adventures continue to entertain and inspire, Captain Holt and Jake's iconic duo stands as a testament to the show's brilliance and the power of unlikely friendships.`,
  `So, here's to the many more hilarious and touching moments from the 99th Precinct and to Captain Holt and Jake—Brooklyn Nine-Nine's most iconic duo!`,
];

export const standaloneNotes = [
  `Data Sources: The original Kaggle dataset can be found <a href="https://www.kaggle.com/datasets/bcruise/brooklyn-99-episode-data" target="_blank" rel="noopener noreferrer" class="italic link">here</a>. I used <a href="https://brooklyn99.fandom.com/wiki/List_of_Episodes#Season_1" target="_blank" rel="noopener noreferrer" class="italic link">WikiFandom</a> and <a href="https://en.wikipedia.org/wiki/Brooklyn_Nine-Nine_season_1" target="_blank" rel="noopener noreferrer" class="italic link">Wikipedia Descriptions</a> for Description 2 and 3 respectively. I manually checked all descriptions and pair results.`,
  `Data Cleaning & Analysis: BeautifulSoup for web scraping. Natural Language Toolkit, OpenAI API for language analysis.`,
  `Data Visualization: Svelte.js & D3.js.`,
  `You can find the code for this project on <a href="https://github.com/soumyakarwa/comedy-duos" target="_blank" rel="noopener noreferrer" class="italic link">github</a>.`,
  `If this peaked your interest, you can find some of my other work on my <a href="https://soumyakarwa.xyz" target="_blank" rel="noopener noreferrer" class="italic link">portfolio</a> or <a href="https://instagram.com/sk.arwaa" target="_blank" rel="noopener noreferrer" class="italic link">instagram</a>.`,
  `Thanks for reading!!`,
];
