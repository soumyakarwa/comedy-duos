<script>
  import Scroller from '@sveltejs/svelte-scroller';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import * as Constants from "./Constants.js"; 

  let sectionTexts = [`Continuing from previous analysis.`, `Conducting the same analysis for all episodes.`, `step 3`];
  let count;
  let index = 0;
  let previousIndex = -1; 
  let offset;
  let progress;
  let top = 0;
  let threshold = 0.5;
  let bottom = 0.9;
  export let episodeData;
  export let specificDataPoint; 
  
  let heatMapSvg;
  const svgWidth = 0.9 * window.innerWidth;
  const svgHeight = 0.9 * window.innerHeight;

  $: if(episodeData || specificDataPoint) {
    const svg = d3.select(heatMapSvg);
    const margin = { top: 100, right: 20, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .domain(episodeData.map(d => d.Episode))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleBand()
      .domain(episodeData.map(d => d.Season))
      .range([height, 0])
      .padding(0.1);
    
    // At index = 0 and Scrolling Down
    if (index == 0 && previousIndex == -1 && progress > 0) {
      const specificRect = g.append('rect')
      .attr('class', 'specific-square')
      .attr('x', x(specificDataPoint.Episode))
      .attr('y', y(specificDataPoint.Season) + y.bandwidth() / 2 - x.bandwidth()/2)
      .attr('width', x.bandwidth())
      .attr('height', x.bandwidth())
      .style('fill', 'none'); 

      const numRows = specificDataPoint["Streamlined Characters"].length;
      const rowHeight = x.bandwidth() / numRows;

      for (let i = 0; i < numRows; i++) {
        g.append('rect')
          .attr('x', +specificRect.attr('x'))
          .attr('y', +specificRect.attr('y') + i * rowHeight)
          .attr('width', 0)
          .attr('height', rowHeight)
          .style('fill', Constants.colors[i % Constants.colors.length])
          .transition()
          .duration(Constants.transitionTime)
          .delay(i * Constants.transitionTime / 2)
          .attrTween("width", function () {
            return d3.interpolate(0, x.bandwidth());
          });
      }
    
      g.append('g')
        .attr('class', 'axis axis-x')
        .call(d3.axisTop(x))
        .style('stroke', 'none'); 

      g.append('g')
        .attr('class', 'axis axis-y')
        .call(d3.axisLeft(y));
      previousIndex = 0
    } 
    // At index = 1 and Scrolling Down
    else if (index == 1 && previousIndex == 0) {
      const squares = g.append('g')
      .selectAll('.square')
      .data(episodeData)
      .enter().append('rect')
      .attr('class', 'square')
      .attr('x', d => x(d.Episode))
      .attr('y', d => y(d.Season) + y.bandwidth() / 2 - x.bandwidth() / 2)
      .attr('width', x.bandwidth())
      .attr('height', x.bandwidth())
      // .style('stroke', 'black')
      // .style('stroke-width', '0.5px')
      .style('fill', 'none')
      .style('opacity', 0); 

      squares
      .style('opacity', 0)
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 1); // Fade in effect

      squares.each(function(d, i) {
        const rect = d3.select(this);
        const numRows = d["Streamlined Characters"].length;
        const rowHeight = x.bandwidth() / numRows;

        const group = g.append('g')
          .attr('class', 'row-group')
          .attr('transform', `translate(${rect.attr('x')}, ${rect.attr('y')})`);

        group.selectAll('rect')
          .data(d3.range(numRows))
          .enter().append('rect')
          .attr('x', 0)
          .attr('y', j => j * rowHeight)
          .attr('width', 0)
          .attr('height', rowHeight)
          .style('fill', j => Constants.colors[j % Constants.colors.length])
          .transition()
          .duration(Constants.transitionTime/5)
          .delay(i * Constants.transitionTime/15)
          .attrTween("width", function () {
            return d3.interpolate(0, x.bandwidth());
          }); // Fade in effect
      });
    }
  };


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
        height: 50vh;
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
      /* background-color: var(--black); 
      stroke: black;
      stroke-width: 2px; */
    }

    .svg-container {
      width: 100vw; 
      height: 100vh; 
      display: flex; 
      align-items: center;
      justify-content: center;
    }

</style>
    