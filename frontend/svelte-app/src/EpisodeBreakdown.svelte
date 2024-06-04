<script>
    import Scroll from "./Scrolly.svelte";
    import { tweened } from "svelte/motion";
    import * as d3 from 'd3';
    import { onMount } from 'svelte';

    let episodeData = []; 
    let specificDataPoint;

    onMount(async () => {
    try {
      episodeData = await d3.csv("/data/brooklynNineNineCharacters.csv");
      specificDataPoint = episodeData.find(d => d.Title === "Hitchcock & Scully");
      console.log("Data loaded:", episodeData);
      console.log("Specific Data Point:", specificDataPoint);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    });
    console.log(episodeData); 

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
  
    const setFoo = function () {
      tweenedX.set(data.map((d) => d.foo));
    };
    const setBar = function () {
      tweenedX.set(data.map((d) => d.bar));
    };
  
    let width = 400;
    let height = 400;
  
    let xScale = d3.scaleLinear().domain([0, 10]).range([0, width]);
    let yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);
  
    let currentStep;
    const steps = [`Let's consider this square to represent an episode.`, `Step 1?`, `Step 2.`];
  
    $: if (currentStep == 0) {
      setFoo();
    } else if (currentStep == 1) {
      setBar();
    } else if (currentStep == 2) {
      setFoo();
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
        <svg {width} {height}>
          {#each data as d, index}
            <circle
              cx={xScale($tweenedX[index])}
              cy={yScale(d.bar)}
              r={15}
              fill="#438A00"
            />
          {/each}
        </svg>
    </div>  
  </section>
  
  
  <style>

    .episode-section {
        display: flex;
        justify-content: center; 
        gap: calc(var(--margin)*2)
        /* height: 100vh;  */
    }

    /* The fixed chart */
    .chart {
        /* background: #ffffff; */
        width: 50vh;
        height: 50vh;
        position: sticky;
        border: 1px solid var(--black); 
        top: 25vh;
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