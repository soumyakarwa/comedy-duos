<script>
  import Scroller from '@sveltejs/svelte-scroller';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import * as Constants from "./Constants.js"; 
  import { group_outros } from 'svelte/internal';

  let sectionTexts = [`Continuing from previous analysis.`, `Conducting the same analysis for all episodes.`, `To streamline, let’s consider pairs with top 10% pairings together.`, `Considering only frequency, we can tell that the pair with the most screen time is Captain Holt and Jake.`];
  let count;
  let index = 0;
  let previousIndex = -1; 
  let offset;
  let progress;
  let top = 0;
  let threshold = 0.5;
  let bottom = 0.9;
  const characterRatingDict = {};
  let sortedCharacterRatingArray; 

  export let episodeData;
  export let specificDataPoint; 
  
  let heatMapSvg;
  const svgWidth = 0.9 * window.innerWidth;
  const svgHeight = 0.9 * window.innerHeight;

  let svg, g, x, y;

  $: if(episodeData.length) {
    svg = d3.select(heatMapSvg);
    const margin = { top: 100, right: 20, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    x = d3.scaleBand()
      .domain(episodeData.map(d => d.Episode))
      .range([0, width])
      .padding(0.1);

    y = d3.scaleBand()
      .domain(episodeData.map(d => d.Season))
      .range([height, 0])
      .padding(0.1);

    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0,${height+10})`)
      .call(d3.axisTop(x))
      .call(g => g.select(".domain").remove()) 
      .call(g => g.selectAll(".tick line").remove()); 

    g.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove()) 
      .call(g => g.selectAll(".tick line").remove());


    episodeData.forEach(item => {
      const characters = item['Streamlined Characters'];
      const rating = item['Rating'];
      const votes = item['Total Votes'];

      characters.forEach(pair => {
          const sorted_pair = pair.sort().toString();  // Sort the pair alphabetically and convert to string
          if (!characterRatingDict[sorted_pair]) {
              characterRatingDict[sorted_pair] = [0, 0.0, 0, 0];
          }
          characterRatingDict[sorted_pair][0] += 1;  // Increment frequency
          characterRatingDict[sorted_pair][1] += rating * votes;  // Add to cumulative weighted rating
          characterRatingDict[sorted_pair][2] += votes;  // Add to total votes
          characterRatingDict[sorted_pair][3] += rating;  // Add to total rating
      });
    });

    // Convert characterRatingDict to an array of objects for easier sorting and processing
    sortedCharacterRatingArray = Object.keys(characterRatingDict).map(key => {
        const [frequency, cumulativeWeightedRating, totalVotes, totalRating] = characterRatingDict[key];
        const averageCumulativeRating = totalVotes > 0 ? cumulativeWeightedRating / totalVotes : 0;
        const averageRating = frequency > 0 ? totalRating / frequency : 0;
        return {
            pair: key.split(','),
            frequency,
            averageCumulativeRating,
            averageRating,
            ratingDifference: averageCumulativeRating - averageRating
        };
    }).sort((a, b) => b.frequency - a.frequency); 
  };

  /**
   * Helper function when index == 1
   */
  function showSpecificSquare() {
    g.selectAll('rect')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('width', 0)
      .remove(); // Clear existing elements

    const specificRect = g.append('rect')
      .attr('class', 'specific-square')
      .attr('x', x(specificDataPoint.Episode))
      .attr('y', y(specificDataPoint.Season) + y.bandwidth() / 2 - x.bandwidth() / 2)
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
  }

  /**
   * Helper function when index == 2
   */
  function showAllSquares() {
    g.selectAll('rect')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('width', 0)
      .remove(); // Clear existing elements

    const squares = g.append('g')
      .selectAll('.square')
      .data(episodeData)
      .enter().append('rect')
      .attr('class', 'square')
      .attr('x', d => x(d.Episode))
      .attr('y', d => y(d.Season) + y.bandwidth() / 2 - x.bandwidth() / 2)
      .attr('width', x.bandwidth())
      .attr('height', x.bandwidth())
      .style('fill', 'none')
      .style('opacity', 0);
      
    squares.each(function(d, i) {
      const rect = d3.select(this);
      const numRows = d["Streamlined Characters"].length;
      const rowHeight = x.bandwidth() / numRows;

      const group = g.append('g')
        .attr('class', 'row-group')
        .attr('transform', `translate(${rect.attr('x')}, ${rect.attr('y')})`);

      group
        .selectAll('rect')
        .data(d["Streamlined Characters"].map((char, j) => ({ char, index: j })))
        .enter().append('rect')
        .attr('x', 0)
        .attr('y', d => d.index * rowHeight)
        .attr('width', 0)
        .attr('height', rowHeight)
        .style('fill', d => Constants.colors[d.index % Constants.colors.length])
        .transition()
        .duration(Constants.transitionTime)
        .attrTween("width", function () {
          return d3.interpolate(0, x.bandwidth());
        });
    });
  }

  /**
   * Helper function when index == 3
   * TBD, ASSIGNING A DIFFERENT COLOR TO EVERY ROW RECT FOR EVERY DISTINCT PAIR
   */
  function updateSquaresForTopPairs() {
    const topPairs = sortedCharacterRatingArray.slice(0, 10).map(d => d.pair);

    g.selectAll('.row-group')
      .each(function(d, i) {
        const group = d3.select(this);
        const rects = group.selectAll('rect');

        // Transition rectangles to be removed
        rects.each(function(d, j) {
          const rect = d3.select(this);
          const pair = d.char;

          if (!topPairs.some(topPair => topPair[0] === pair[0] && topPair[1] === pair[1])) {
            rect.transition()
              .duration(Constants.transitionTime)
              .style('opacity', 0)
              .attr('width', 0)
              .remove();
          }
        });

        // Transition remaining rectangles after removal
        rects
          .filter(function(d) {
            const pair = d.char;
            return topPairs.some(topPair => topPair[0] === pair[0] && topPair[1] === pair[1]);
          })
          .transition()
          .delay(Constants.transitionTime)
          .duration(Constants.transitionTime)
          .attr('y', (d, i, nodes) => (i * x.bandwidth()) / nodes.length)
          .attr('height', (d, i, nodes) => x.bandwidth() / nodes.length);
      });
  }

  // Call the updateHeatMap function based on the index value
  $: if(g) {
    if (index == 0) {
      showSpecificSquare();
    } else if (index == 1) {
      showAllSquares();
    } else if (index == 2) {
      updateSquaresForTopPairs();
    }
  }


</script>

<section class="webpage-section">
    <Scroller
      {top}
      {threshold}
      {bottom}
      bind:count
      bind:index
      bind:offset
      bind:progress
    >
      <div slot="background" style="padding: 0; pointer-events: all;">         
        <div class="svg-container">
            <svg bind:this={heatMapSvg} width={svgWidth} height={svgHeight} viewBox="0 0 {svgWidth} {svgHeight}" class="heatmap-svg"></svg>
        </div>
      </div>
  
      <div slot="foreground">
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
      pointer-events: all;
      /* background-color: red; */
      /* transform: translate(0px,0px);  */
    }
  
    /* [slot="foreground"] {
      pointer-events: none;
    } */

    .svg-container {
      width: 100vw; 
      height: 100vh; 
      display: flex; 
      align-items: center;
      justify-content: center;
    }

</style>
    