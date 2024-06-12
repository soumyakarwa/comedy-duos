<script>
  import Scroller from '@sveltejs/svelte-scroller';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import * as Constants from "./Constants.js"; 
  import { group_outros } from 'svelte/internal';

  let sectionTexts = [`Continuing from previous analysis.`, `In the previous section we analysed Season 3, Episode 6, "Into the woods". Let's put the anlaysis onto a grid.`, `Conducting the same analysis for all episodes.`, `To streamline, let’s consider pairs with top 10% pairings together.`, `Considering only frequency, we can tell that the pair with the most screen time is Captain Holt and Jake.`];
  let count;
  let index = 0;
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
  

  let svg, g, originalXScale, originalYScale, legend, chartWidth, chartHeight, frequencyXScale, frequencyYScale, topPairs, frequencies;
  const margin = { top: 100, right: 20, bottom: 50, left: 50 };

  $: if(episodeData.length) {
    svg = d3.select(heatMapSvg);
    chartWidth = svgWidth - margin.left - margin.right;
    chartHeight = svgHeight - margin.top - margin.bottom;

    g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    originalXScale = d3.scaleBand()
      .domain(episodeData.map(d => d.Episode))
      .range([0, chartWidth])
      .padding(0.1);

    originalYScale = d3.scaleBand()
      .domain(episodeData.map(d => d.Season))
      .range([chartHeight, 0])
      .padding(0.1);

    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', `translate(0,${chartHeight+10})`)
      .call(d3.axisTop(originalXScale))
      .call(g => g.select(".domain").remove()) 
      .call(g => g.selectAll(".tick line").remove()); 

    g.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(originalYScale))
      .call(g => g.select(".domain").remove()) 
      .call(g => g.selectAll(".tick line").remove());

    g.append("text")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("x", chartWidth / 2)
      .attr("y", chartHeight + margin.top/4)
      .text("Episode");

    // Add Y axis label
    g.append("text")
      .attr("class", "y-axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-margin.left/2},${chartHeight/2}) rotate(-90)`)
      .text("Season");


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

    // topPairs = sortedCharacterRatingArray.slice(0, 10).map(d => d.pair.join(' & '));
    topPairs = sortedCharacterRatingArray.slice(0, 10).map(d => pairToString(d.pair));
    frequencies = sortedCharacterRatingArray.slice(0, 10).map(d => d.frequency);

    frequencyXScale = d3.scaleBand()
        .domain(topPairs)
        .range([0, chartWidth])
        .padding(0.1);

    // Create yScale for frequencies
    frequencyYScale = d3.scaleLinear()
        .domain([0, d3.max(frequencies)])
        .range([chartHeight, margin.top/2]);

  };

  /**
   * Reverts axes to original heat map axes
   */
  function heatMapAxes(){
    g.select('.axis-x')
        .transition()
        .duration(Constants.transitionTime)
        .attr('transform', `translate(0,${chartHeight + 10})`)
        .call(d3.axisTop(originalXScale))
        .call(g => g.selectAll(".tick line").remove())
        .call(g => g.select(".domain").remove());
        
        
    // Update y-axis with transition
    g.select('.axis-y')
        .transition()
        .duration(Constants.transitionTime)
        .call(d3.axisLeft(originalYScale))
        .call(g => g.select(".domain").remove()) 
        .call(g => g.selectAll(".tick line").remove());

    // Update x-axis label
    g.select(".x-axis-label")
        .transition()
        .duration(Constants.transitionTime)
        .attr("x", chartWidth / 2)
        .attr("y", chartHeight + margin.top / 4)
        .text("Episode");

    // Update y-axis label
    g.select(".y-axis-label")
        .transition()
        .duration(Constants.transitionTime)
        .attr("transform", `translate(${-margin.left / 2},${chartHeight / 2}) rotate(-90)`)
        .text("Season");
  }


  /**
   * helper function to stringify pair
   * @param pair
   */
  function pairToString(pair){
    return pair.join(' & '); 
  }

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
      .attr('x', originalXScale(specificDataPoint.Episode))
      .attr('y', originalYScale(specificDataPoint.Season) + originalYScale.bandwidth() / 2 - originalXScale.bandwidth() / 2)
      .attr('width', originalXScale.bandwidth())
      .attr('height', originalXScale.bandwidth())
      .style('fill', 'none'); 

    const numRows = specificDataPoint["Streamlined Characters"].length;
    const rowHeight = originalXScale.bandwidth() / numRows;

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
          return d3.interpolate(0, originalXScale.bandwidth());
        });
    }
  }

  /**
   * Helper function when index == 2
   */
  function showAllSquares() {
    g.selectAll('.legend')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove();

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
      .attr('x', d => originalXScale(d.Episode))
      .attr('y', d => originalYScale(d.Season) + originalYScale.bandwidth() / 2 - originalXScale.bandwidth() / 2)
      .attr('width', originalXScale.bandwidth())
      .attr('height', originalXScale.bandwidth())
      .style('fill', 'none')
      .style('opacity', 0);
      
    squares.each(function(d, i) {
      const rect = d3.select(this);
      const numRows = d["Streamlined Characters"].length;
      const rowHeight = originalXScale.bandwidth() / numRows;

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
          return d3.interpolate(0, originalXScale.bandwidth());
        });
    });
  }

  /**
   * Helper function when index == 3
   *
   */
  function updateSquaresForTopPairs() {

    const currentDomain = g.select('.axis-x').selectAll('.tick').data();

    // Compare current domain with new domain
    if (JSON.stringify(currentDomain) === JSON.stringify(frequencyXScale.domain())) {
        // Revert axes if the current domain matches the new xScale domain
        heatMapAxes();
    } 
   
    const pairToColor = new Map();
    topPairs.forEach((pair, index) => {
        pairToColor.set(pair, Constants.colors[index % 5]);
    });

    g.selectAll('.row-group')
      .each(function(d, i) {
        const group = d3.select(this);
        const rects = group.selectAll('rect');

        // Transition rectangles to be removed
        rects.each(function(d, j) {
          const rect = d3.select(this);
          const pair = d.char;
          
          if (!topPairs.some(topPair => topPair === pairToString(pair))) {
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
            return topPairs.some(topPair => topPair === pairToString(pair)); 
          })
          .transition()
          .delay(Constants.transitionTime)
          .duration(Constants.transitionTime)
          .attr('y', (d, i, nodes) => (i * originalXScale.bandwidth()) / nodes.length)
          .attr('height', (d, i, nodes) => originalXScale.bandwidth() / nodes.length)
          .style('fill', d => {
              const pair = d.char;
              return pairToColor.get(pairToString(pair)) || 'grey'; // Default color if not found
          });
      });

    // Group pairs by color
    const colorToPairs = new Map();
    topPairs.forEach((pair, index) => {
        const color = Constants.colors[index % 5];
        if (!colorToPairs.has(color)) {
            colorToPairs.set(color, []);
        }
        colorToPairs.get(color).push(pair);
    });

    g.selectAll('.legend')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove();

    // Create legend
    legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${chartWidth - 250}, 0)`); // Adjust position as needed

    let legendIndex = 0;
    colorToPairs.forEach((pairs, color) => {
        const pairText = pairs.join(' or ');

        const legendItem = legend.append('g')
          .attr('class', 'legend-item')
          .attr('transform', `translate(0, ${legendIndex * 20})`); // Adjust spacing as needed

        legendItem.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', 18)
          .attr('height', 18)
          .style('fill', color);

        legendItem.append('text')
          .attr('x', 24)
          .attr('y', 9)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'start') // Ensuring text is left-aligned
          .style('font-size', Constants.labelFontSize) // Set font size using style
          .style('transform', 'none') // Remove any transform styles
          .text(pairText);

        legendIndex++;
    });

  }

  /**
   * 
   */
  function createStackedBarChart(){
    g.selectAll('.legend')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove();

    // const topPairs = sortedCharacterRatingArray.slice(0, 10).map(d => d.pairToString(pair));
    // const frequencies = sortedCharacterRatingArray.slice(0, 10).map(d => d.frequency);

    // Create xScale for pairs
    // const newX = d3.scaleBand()
    //     .domain(topPairs)
    //     .range([0, chartWidth])
    //     .padding(0.1);

    // // Create yScale for frequencies
    // const newY = d3.scaleLinear()
    //     .domain([0, d3.max(frequencies)])
    //     .range([chartHeight, margin.top/2]);

    // Update x-axis
    g.select('.axis-x')
        .transition()
        .duration(Constants.transitionTime)
        .call(d3.axisBottom(frequencyXScale))
        .attr('transform', `translate(0,${chartHeight})`);

    // Update y-axis with transition
    g.select('.axis-y')
        .transition()
        .duration(Constants.transitionTime)
        .call(d3.axisLeft(frequencyYScale));

     // Update x-axis label
     g.select(".x-axis-label")
        .transition()
        .duration(Constants.transitionTime)
        .attr("y", chartHeight + margin.top/4+15)
        .text("Top Character Pairs");

    // Update y-axis label
    g.select(".y-axis-label")
        .transition()
        .duration(Constants.transitionTime)
        .attr("transform", `translate(${-margin.left/2-5},${chartHeight/2}) rotate(-90)`)
        .text("Frequency"); 
  }


  // Call the updateHeatMap function based on the index value
  $: if(g) {
    if (index == 1) {
      showSpecificSquare();
    } else if (index == 2) {
      showAllSquares();
    } else if (index == 3) {
      updateSquaresForTopPairs();
    } else if (index == 4) {
      createStackedBarChart();
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
    