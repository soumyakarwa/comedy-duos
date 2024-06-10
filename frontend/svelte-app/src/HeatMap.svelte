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
    
    export let episodeSvg; // Receive the episodeSvg reference as a prop

    $: if (episodeSvg && index === 0 && progress > 0.1) {
        console.log("episodeSvg received in HeatMap and scrolled into view:", episodeSvg);
        // Use d3 to manipulate the SVG elements referenced by episodeSvg
        const svgElement = d3.select(episodeSvg);
        console.log(svgElement);
        // Example: Change the fill color of all rects
        svgElement.selectAll('rect').attr('fill', 'blue');
        // Change the SVG size
        // svgElement
        // .attr('width', '90%')
        // .attr('height', '90%');
        // Additional manipulations can be performed here
    } else {
        console.log("episodeSvg not available in HeatMap or not in view");
    }
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
        {#if index > 0 && progress > 0.1}
            <svg bind:this={episodeSvg} width="300" height="300" viewBox="0 0 300 300"></svg>
        {/if}
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
      background-color: red;
      /* transform: translate(0px,0px);  */
    }
  
    [slot="foreground"] {
      pointer-events: none;
    }
    
    .text-section {
        height: 80vh;
        color: black;
        padding: var(--margin);
        margin-bottom: var(--margin); 
        font-size: var(--body-font-size);
        display: flex; 
        justify-content: center;
  }

    .description {
        background-color: rgba(246, 244, 245, 0.9);
        height: fit-content; 
        padding: var(--margin); 
    }
</style>
    