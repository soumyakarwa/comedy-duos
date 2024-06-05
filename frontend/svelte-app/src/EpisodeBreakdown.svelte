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
    let highlightElements = []; 

    function highlightDescription(description, analysis) {
        let highlighted = description; 
        let correctedAnalysis = analysis
            .replace(/'sentence'/g, '"sentence"')
            .replace(/'characters'/g, '"characters"')
            .replace(/:\s*'([^']+)'/g, ': "$1"') // Replace single-quoted string values
            .replace(/:\s*\[(.*?)\]/g, (match, p1) => {
                const replacedContent = p1.replace(/'([^']+)'/g, '"$1"');
                return `: [${replacedContent}]`;
        });

        const parsedAnalyis = JSON.parse(correctedAnalysis); 
        parsedAnalyis.forEach(item => {
            let sentence = item.sentence;
            let span = `<span class="highlight">${sentence}</span>`
            highlighted = highlighted.replace(sentence, span);
        });
        return highlighted;
    }

    function startAnimation() {
        const highlightElements = document.querySelectorAll('.highlight');
        highlightElements.forEach(element => {
            element.style.animation = 'none';
            requestAnimationFrame(() => {
                element.style.animation = '';
                element.style.animation = 'highlight-animation calc(var(--transition-time)*2) linear forwards';
            });
        });
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

    onMount(async () => {
        try {   
            episodeData = await d3.csv("/data/brooklynNineNineCharacters.csv");
            specificDataPoint = episodeData.find(d => d.Title === "Hitchcock & Scully");
            console.log(specificDataPoint); 
        } catch (error) {
            console.error("Error loading data:", error);
        }

        const svgRect = svg.getBoundingClientRect();
        width = svgRect.width;
        svg.setAttribute("height", width);

        episodeDescriptions[0] = highlightDescription(specificDataPoint[`Episode Description`], specificDataPoint[`Episode Description Analysis`]); 
        episodeDescriptions[1] = highlightDescription(specificDataPoint[`Wiki Fandom Descriptions`], specificDataPoint[`Wiki Fandom Description Analysis`]); 
        episodeDescriptions[2] = highlightDescription(specificDataPoint[`Wikipedia Episode Descriptions`], specificDataPoint[`Wikipedia Description Analysis`]);
    });

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
                <span class="italic">Official Description</span>
                <br>
                {@html episodeDescriptions[0]}
            </div>
            <svg bind:this={svg}>
                {#if width > 0}
                    <rect x={0} y={0} width={width} height={width} fill="#438A00"></rect>
                {/if}
            </svg>
            <div id="wikifandomDescription" class="episodeDescriptions" class:active={$showDescriptions}> 
                <span class="italic">Wiki Fandom Description</span>
                <br>
                {@html  episodeDescriptions[1]}
            </div>
        </div>
        <div id="col2">
            <div id="wikipediaDescription" class="episodeDescriptions" class:active={$showDescriptions}>  
                <span class="italic">Wikipedia Description</span>
                <br>
                {@html episodeDescriptions[2]}
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
