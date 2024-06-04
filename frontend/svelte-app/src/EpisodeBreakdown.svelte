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

  const showDescriptions = writable(false);

  onMount(async () => {
      try {
          episodeData = await d3.csv("/data/brooklynNineNineCharacters.csv");
          specificDataPoint = episodeData.find(d => d.Title === "Hitchcock & Scully");
          console.log("Data loaded:", episodeData);
          episodeDescriptions = [specificDataPoint[`Episode Description`], specificDataPoint[`Wiki Fandom Descriptions`], specificDataPoint[`Wikipedia Episode Descriptions`]];
      } catch (error) {
          console.error("Error loading data:", error);
      }

      const svgRect = svg.getBoundingClientRect();
      width = svgRect.width;
      svg.setAttribute("height", width);
  });

  let data = [
      { foo: 4, bar: 1 },
      { foo: 6, bar: 7 },
      { foo: 9, bar: 5 },
      { foo: 2, bar: 4 },
      { foo: 8, bar: 2 },
      { foo: 9, bar: 9 },
      { foo: 5, bar: 3 },
      { foo: 3, bar: 8 },
      { foo: 1, bar: 6 },
  ];

  const tweenedX = tweened(data.map((d) => d.foo));

  const setBar = function () {
      tweenedX.set(data.map((d) => d.bar));
  };

  let currentStep;
  const steps = [`Let's consider this square to represent an episode.`, `As I mentioned previously, here are the three epsiode Descriptions, for Season 7, Episode 6 titled "Hitchcock & Scully."`, `Step 2.`];

  $: if (currentStep == 1 || currentStep == 2) {
      showDescriptions.set(true);
  } else {
      showDescriptions.set(false);
      if (currentStep == 0) {
          setBar();
      }
  }
</script>

<section class="episode-section">
  <!-- The scrolling container which includes each of the text elements -->
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
          <div class="episodeDescriptions" class:active={$showDescriptions}>{episodeDescriptions[0]}</div>
          <svg bind:this={svg}>
              {#if width > 0}
                  <rect x={0} y={0} width={width} height={width} fill="#438A00"></rect>
              {/if}
          </svg>
          <div class="episodeDescriptions" class:active={$showDescriptions}>{episodeDescriptions[1]}</div>
      </div>
      <div id="col2">
          <div class="episodeDescriptions" class:active={$showDescriptions}>{episodeDescriptions[2]}</div>
      </div>
  </div>  
</section>

<style>
  .episode-section {
      display: flex;
      justify-content: space-evenly; 
      gap: var(--margin)
  }

  /* The fixed chart */
  .chart {
      width: 40vw;
      height: 80vh;
      position: sticky;
      /* border: 1px solid var(--black);  */
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

  .episodeDescriptions {
      opacity: 0;
      transition: opacity 500ms ease;
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
      transition: background-color 500ms ease;
      z-index: 10;
  }

  .step.active .step-content {
      opacity: 1;  
  }
</style>
