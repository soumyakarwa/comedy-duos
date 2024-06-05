<script>
    import Scroll from "./Scrolly.svelte";
    import { tweened } from "svelte/motion";
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let episodeData = []; 
    let specificDataPoint;
    let svg; 
    let width; 
    let episodeDescriptions = []; 
    let highlightElement;

    onMount(async () => {
    const chosenDataPoint =   
        {Airdate: "4/4/19", 
        Episode: "2", 
        EpisodeDescription:"Jake and Charles investigate a case of Hitchcock and Scully's from the 1980s; meanwhile, Amy's uniformed officers and Terry's detectives fight over limited resources.", 
        EpisodeDescriptionAnalysis: [{sentence: "Jake and Charles investigate a case of Hitchcock and Scully's from the 1980s; meanwhile, Amy's uniformed officers and Terry's detectives fight over limited resources.", characters: ['Jake', 'Charles', 'Amy', 'Terry']}], 
        EpisodeDescriptionFiltered: [{sentence: "Jake and Charles investigate a case of Hitchcock and Scully's from the 1980s; meanwhile, Amy's uniformed officers and Terry's detectives fight over limited resources.", characters: ['Jake', 'Charles', 'Amy', 'Terry']}],
        Rating: "8.8", 
        Season: "6",
        StreamlinedCharacters: [['Jake', 'Charles'], ['Amy', 'Terry'], ['Gina', 'Holt']],
        Title: "Hitchcock & Scully",
        TotalVotes: "2998",
        WikiFandomDescriptionAnalysis: [{sentence: "Jake and Charles investigate a case of Hitchcock and Scully from the 1980s.", characters: ['Jake', 'Charles']}, {sentence: "Meanwhile, Amy's uniformed officers and Terry's detectives fight over limited resources.", characters: ['Amy', 'Terry']},{sentence: '[2]', 'characters': []}],
        WikiFandomDescriptionFiltered: [{sentence: "Jake and Charles investigate a case of Hitchcock and Scully from the 1980s.", characters: ['Jake', 'Charles']}, {sentence: "Meanwhile, Amy's uniformed officers and Terry's detectives fight over limited resources.", characters: ['Amy', 'Terry']}],
        WikiFandomDescriptions: "Jake and Charles investigate a case of Hitchcock and Scully from the 1980s. Meanwhile, Amy's uniformed officers and Terry's detectives fight over limited resources.[2]",
        WikipediaClausesAnalysis: [{sentence: "Jake and Charles investigate a case from Hitchcock and Scully's younger days to determine if the two older detectives are withholding any stolen cash.", characters: ['Jake', 'Charles']}, {sentence: "Due to Holt's campaign against John Kelly", characters: ['Holt']}, {sentence: 'the Commissioner closes off the lower level', characters: []}, {sentence: 'forces most of the departments to work in a tight space', characters: []}, {sentence: 'leading to Amy and her officers coming into conflict with Terry and Rosa', characters: ['Amy', 'Terry', 'Rosa']}, {'sentence': 'Gina helps Holt prepare for a televised interview.', characters: ['Gina', 'Holt']}],
        WikipediaClausesFiltered: [{sentence: "Jake and Charles investigate a case from Hitchcock and Scully's younger days to determine if the two older detectives are withholding any stolen cash.", characters: ['Jake', 'Charles']}, {sentence: 'leading to Amy and her officers coming into conflict with Terry and Rosa', characters: ['Amy', 'Terry', 'Rosa']}, {sentence: 'Gina helps Holt prepare for a televised interview.', characters: ['Gina', 'Holt']}],
        WikipediaDescriptionAnalysis: [{sentence: "Jake and Charles investigate a case from Hitchcock and Scully's younger days to determine if the two older detectives are withholding any stolen cash.", characters: ['Jake', 'Charles']}, {sentence: "Due to Holt's campaign against John Kelly, the Commissioner closes off the lower level and forces most of the departments to work in a tight space, leading to Amy and her officers coming into conflict with Terry and Rosa.", characters: ['Holt', 'Amy', 'Terry', 'Rosa']}, {sentence: 'Gina helps Holt prepare for a televised interview.', 'characters': ['Gina', 'Holt']}],
        WikipediaDescriptionClauses: ["Jake and Charles investigate a case from Hitchcock and Scully's younger days to determine if the two older detectives are withholding any stolen cash.", "Due to Holt's campaign against John Kelly", 'the Commissioner closes off the lower level', 'forces most of the departments to work in a tight space', 'leading to Amy and her officers coming into conflict with Terry and Rosa', 'Gina helps Holt prepare for a televised interview.'],
        WikipediaEpisodeDescriptions: "Jake and Charles investigate a case from Hitchcock and Scully's younger days to determine if the two older detectives are withholding any stolen cash. Due to Holt's campaign against John Kelly, the Commissioner closes off the lower level and forces most of the departments to work in a tight space, leading to Amy and her officers coming into conflict with Terry and Rosa. Gina helps Holt prepare for a televised interview."
    };
        
    try {
            episodeData = await d3.csv("/data/brooklynNineNineCharacters.csv");
            specificDataPoint = episodeData.find(d => d.Title === "Hitchcock & Scully");
            console.log(specificDataPoint)
            episodeDescriptions = [specificDataPoint[`Episode Description`], specificDataPoint[`Wiki Fandom Descriptions`], specificDataPoint[`Wikipedia Episode Descriptions`]];
        } catch (error) {
            console.error("Error loading data:", error);
        }

        const svgRect = svg.getBoundingClientRect();
        width = svgRect.width;
        svg.setAttribute("height", width);

        highlightedDescription = highlightDescription(specificDataPoint[`Episode Description`], specificDataPoint[`Episode Description Analysis`]); 
    });

    function startAnimation() {
        highlightElement.style.animation = 'none';
        requestAnimationFrame(() => {
            highlightElement.style.animation = '';
            highlightElement.style.animation = 'highlight-animation var(--transition-time) linear forwards';
        });
    }

    let highlightedDescription = '';

    function highlightDescription(description, analysis) {
        let highlighted = description; 
        
        console.log(`Analysis is ${analysis}`)
        let correctedAnalysis = analysis
        .replace(/'sentence'/g, '"sentence"')
        .replace(/'characters'/g, '"characters"')
        .replace(/:\s*\[(.*?)\]/g, (match, p1) => {
            const replacedContent = p1.replace(/'([^']+)'/g, '"$1"');
            return `: [${replacedContent}]`;
        });

    
        const parsedAnalyis = JSON.parse(correctedAnalysis); 

        console.log(parsedAnalyis);

        parsedAnalyis.forEach(item => {
            let sentence = item.sentence;
            highlighted = highlighted.replace(sentence, `<span class="highlight">${sentence}</span>`);
        });
        console.log(highlighted)
        return highlighted;
    }

    const showDescriptions = writable(false);

    let currentStep;
    const steps = [`Let's consider this square to represent an episode.`, `Using three different descriptions provided me more insight, and allowed me to compare and contrast the plots for each episode.`, `Breaking the descriptions down to sentences provides insight about the different plot points.`];

    $: if (currentStep == 1) {
        showDescriptions.set(true);
    } 
    
    $: if (currentStep == 2){
        startAnimation()
    }
</script>

<section class="episode-section">
    <Scroll bind:value={currentStep}>
        {#each steps as text, i}
            <div class="step" class:active={currentStep === i}>
                <div class="step-content">
                    {@html text}
                </div>
            </div>
        {/each}
    </Scroll>

    <div class="chart">
        <div id="col1"> 
            <div id="officialDescription" class="episodeDescriptions" class:active={$showDescriptions}>
                <span span bind:this={highlightElement} class="italic highlight">Official Description</span>
                <br>
                {episodeDescriptions[0]}
            </div>
            <svg bind:this={svg}>
                {#if width > 0}
                    <rect x={0} y={0} width={width} height={width} fill="#438A00"></rect>
                {/if}
            </svg>
            <div id="wikifandomDescription" class="episodeDescriptions" class:active={$showDescriptions}> 
                <span class="italic">Wiki Fandom Description</span>
                <br>
                {episodeDescriptions[1]}
            </div>
        </div>
        <div id="col2">
            <div id="wikipediaDescription" class="episodeDescriptions" class:active={$showDescriptions}>  
                <span class="italic">Wikipedia Description</span>
                <br>
                {episodeDescriptions[2]}
            </div>
        </div>
    </div>  
</section>

<style>
  .episode-section {
      display: flex;
      justify-content: space-evenly; 
      gap: var(--margin)
  }

  .chart {
      width: 45vw;
      height: 80vh;
      position: sticky;
      top: 10vh;
      display:flex; 
      flex-direction: row;
      align-items: center;
      gap: var(--margin);
      padding-left:calc(var(--margin)*2); 
  }

  #col1 {
      display: flex; 
      flex-direction: column;
      gap: calc(var(--margin)/2); 
      max-width: 50%; 
  }

  #col2 {
      max-width: 50%; 
  }

  #wikifandomDescription {
    margin-top: 0.3rem; 
  }

  #wikipediaDescription {
    max-width: 80%; 
}

    .episodeDescriptions {
      opacity: 0;
      transition: opacity var(--transition-time) ease;
      font-size: var(--label-font-size);
    }

  .episodeDescriptions.active {
      opacity: 1;
  }

  svg {
      width: 100%;
      /* height: 100%; */
  }

  /* Scrollytelling CSS */
  .step {
      height: 60vh;
      max-width: 35vw; 
      display: flex;
      place-items: center;
      justify-content: center;
  }

  .step-content {
      /* max-width: 35vw;  */
      background: var(--white);
      opacity: 0.2; 
      color: var(--black);
      padding: var(--margin);
      display: flex;
      flex-direction: column;
      justify-content: center;
      transition: background-color var(--transition-time) ease;
      z-index: 10;
  }

  .step.active .step-content {
      opacity: 1;  
  }
</style>
