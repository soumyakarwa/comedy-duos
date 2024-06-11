<script>
    import Scroller from '@sveltejs/svelte-scroller';
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    
    let sectionTexts = [`step 1`, `step 2`, `step 3`];
    let count;
    let index = 0;
    let offset;
    let progress;
    let top = 0;
    let threshold = 0.5;
    let bottom = 0.9;

    let heatMapSvg; 
    let svgWidth = 0.9*window.innerWidth; 
    let svgHeight = 0.9*window.innerHeight; 

    
</script>   

<section class="map-section">
    <Scroller
      {top}
      {threshold}
      {bottom}
      bind:count
      bind:index
      bind:offset
      bind:progress
    >
      <div slot="background" style="padding: 0;">         
        <div class="svg-container">
            <svg bind:this={heatMapSvg} width={svgWidth} height={svgHeight} viewBox="0 0 {svgWidth} {svgHeight}" class="heatmap-svg"></svg>
        </div>
      </div>
  
      <div slot="foreground" style="padding-left: 32.5vw; padding-top: 10%; width:35vw;">
        {#each sectionTexts as text}
            <section class="text-section"><div class="description">{@html text}</div></section>
        {/each}
      </div>
    </Scroller>
</section>
  
  <style>
    [slot="background"] {
      width: 100%;
      height: 100vh;
      /* background-color: red; */
      /* transform: translate(0px,0px);  */
    }
  
    [slot="foreground"] {
      pointer-events: none;
    }
    
    .text-section {
        height: 80vh;
        color: var(--black);
        padding: var(--margin);
        margin-bottom: var(--margin); 
        font-size: var(--body-font-size);
        display: flex; 
        justify-content: center;
  }

    .description {
        background-color: var(--faded-white);
        height: fit-content; 
        padding: var(--margin); 
    }

    .heatmap-svg {
      background-color: var(--black); 
      stroke: black;
      stroke-width: 2px;
    }

    .svg-container {
      width: 100vw; 
      height: 100vh; 
      display: flex; 
      align-items: center;
      justify-content: center;
    }

</style>
    