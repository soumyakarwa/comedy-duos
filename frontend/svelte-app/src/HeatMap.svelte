<script>
  import * as d3 from 'd3';
  import * as Constants from "./Constants.js"; 
  import {remToPixels} from "./Constants.js"; 
  import { onMount } from 'svelte';

  const characterRatingDict = {};
  let sortedCharacterRatingArray; 
  let heatMapSection; 
  var img1, img2, img3, img4, img5, img6, img7, img8, img9; 

  export let episodeData;
  export let specificDataPoint; 
  export let index; 
  
  let heatMapSvg;
  let svgWidth = 0.9 * window.innerWidth;
  let svgHeight = 0.9 * window.innerHeight;
  let lastStepImages = [
    { var: img1, id: 'img1', src: 'assets/finale/jakeholt-1.gif', alt: 'holt and jake joke 1' },
    { var: img2, id: 'img2', src: 'assets/finale/jakeholt-2.jpeg', alt: 'holt and jake joke 2' },
    { var: img3, id: 'img3', src: 'assets/finale/jakeholt-3.jpeg', alt: 'holt and jake joke 3' },
    { var: img4, id: 'img4', src: 'assets/finale/jakeholt-4.jpeg', alt: 'holt and jake joke 4' },
    { var: img5, id: 'img5', src: 'assets/finale/jakeholt-5.gif', alt: 'holt and jake joke 5' },
    { var: img6, id: 'img6', src: 'assets/finale/jakeholt-6.jpeg', alt: 'holt and jake joke 6' },
    { var: img7, id: 'img7', src: 'assets/finale/jakeholt-7.gif', alt: 'holt and jake joke 7' },
    { var: img8, id: 'img8', src: 'assets/finale/jakeholt-8.jpeg', alt: 'holt and jake joke 8' },
    { var: img9, id: 'img9', src: 'assets/finale/jakeholt-9.gif', alt: 'holt and jake joke 9' }
  ];
  
  /**
   * svg: heatmap svg
   * g: group for the heatmap
   * originalXScale: heatMap X-scale for episodes
   * originalYScale: heatMap Y-scale for seasonS
   * legend: group for legend (top 10 character pairings)
   * chartWidth: chartWidth is the width of g in heatmap
   * chartHeight: chartHeight is the height of the g in heatmap
   * frequencyXScale: frequency vs pairing x-scale for frequency bar chart 
   * frequencyYScale: frequency vs pairing y-scale for frequency bar chart
   * ratingXScale: average cummulative rating vs pairing x-scale (same as frequencyXScale) 
   * ratingYScale: average cummulative rating vs pairing y-scale for rating bar chart
   * topPairs: 10 pairs with the highest frequency (most appearences together)
   * frequencies: sortedCharacterArray for just pair and frequency
   * pairToColor: a map for pair-color from Constants.colors
   * ratings: sortedCharacterArray for just pair and average cummulative frequency
   */
  let svg, g, originalXScale, originalYScale, legend, chartWidth, chartHeight, frequencyXScale, frequencyYScale, topPairs, frequencies, pairToColor, ratingXScale, ratingYScale, ratings; 

  let xaxis = null; 
  let yaxis = null; 
  let xaxisLabel = null; 
  let yaxisLabel = null; 
  let baseSquares; 
  
  let xAxisXYPos, xAxisWidth, xAxisTranslatePos, xAxisLabelXYPos;
  let yAxisXYPos, yAxisHeight, yAxisTranslatePos, yAxisLabelTranslatePos;
  
  const pageMarginInPixels = remToPixels(Constants.margin); 
  // margin from svgHeight, svgWidth to create chartSize
  const margin = { 
    top: pageMarginInPixels*9, 
    right: pageMarginInPixels, 
    bottom: pageMarginInPixels, 
    left: pageMarginInPixels*2 
  };

  $: if(episodeData.length & index == 0) {
    svg = d3.select(heatMapSvg);

    chartWidth = svgWidth - margin.left - margin.right;
    chartHeight = svgHeight - margin.top - margin.bottom;
    
    xAxisTranslatePos = [0, chartHeight - pageMarginInPixels]; 
    xAxisXYPos = [pageMarginInPixels*2, chartWidth]; 
    xAxisWidth = xAxisXYPos[1] - xAxisXYPos[0];
    xAxisLabelXYPos = [margin.left + xAxisWidth / 2, chartHeight+7]; 

    yAxisTranslatePos = [pageMarginInPixels*2, 0]; 
    yAxisXYPos = [pageMarginInPixels*2, chartHeight-5]; 
    yAxisHeight = yAxisXYPos[1] - yAxisXYPos[0]; 
    yAxisLabelTranslatePos = [0, pageMarginInPixels*2]; 

    g = svg.select('g');
    if (g.empty()) {
      g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    }

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
    if(!sortedCharacterRatingArray){
      sortedCharacterRatingArray = Object.keys(characterRatingDict).map(key => {
        const [frequency, cumulativeWeightedRating, totalVotes, totalRating] = characterRatingDict[key];
        const averageCumulativeRating = totalVotes > 0 ? cumulativeWeightedRating / totalVotes : 0;
        const averageRating = frequency > 0 ? totalRating / frequency : 0;
        return {
            pair: key.split(','),
            frequency,
            averageCumulativeRating,
            averageRating,
            totalVotes,
            ratingDifference: averageCumulativeRating - averageRating
        };
        }).sort((a, b) => b.frequency - a.frequency); 
        topPairs = sortedCharacterRatingArray.slice(0, 10).map(d => pairToString(d.pair));
        frequencies = sortedCharacterRatingArray.slice(0, 10).map(d => d.frequency);
        ratings = sortedCharacterRatingArray.slice(0, 10).map(d => d.averageCumulativeRating);
    }
  

    pairToColor = new Map();
    topPairs.forEach((pair, index) => {
        pairToColor.set(pair, Constants.heatMapColors[index]);
    });


    setScales(topPairs); 

    if(!xaxis){
      xaxis =  g
      .append('g')
      .attr('class', 'axis axis-x'); 
    }

    if(!xaxisLabel){  
      xaxisLabel = g.append("text")
        .attr("class", "x-axis-label")
        .attr("text-anchor", "middle"); 
    }

    if(!yaxis){
      yaxis = g.append('g')
        .attr('class', 'axis axis-y'); 
    }

    if(!yaxisLabel){    
      yaxisLabel = g.append("text")
        .attr("class", "y-axis-label")
    }
    
    xaxis
      .attr('transform', `translate(${xAxisTranslatePos[0]},${xAxisTranslatePos[1]})`)
      .call(d3.axisTop(originalXScale))
      .call(g => g.select(".domain").remove()) 
      .call(g => g.selectAll(".tick line").remove()); 

    yaxis
      .attr('transform', `translate(${yAxisTranslatePos[0]},${yAxisTranslatePos[1]})`)
      .call(d3.axisLeft(originalYScale))
      .call(g => g.select(".domain").remove()) 
      .call(g => g.selectAll(".tick line").remove());

    xaxisLabel  
        .transition()  
        .attr("x", xAxisLabelXYPos[0])
        .attr("y", xAxisLabelXYPos[1])
        .text("Episode");
      
    yaxisLabel  
      .transition()  
      .attr("x", yAxisLabelTranslatePos[0])
      .attr("y", yAxisLabelTranslatePos[1] - originalXScale.bandwidth())
      .text("Season");   

  };

  function setScales(pairs){
    // EPISODES INCREASES FROM 0 TO MAX EPISODES, LEFT TO RIGHT  
    originalXScale = d3.scaleBand()
      .domain(episodeData.map(d => d.Episode))
      .range([xAxisXYPos[0], xAxisXYPos[1]])
      .padding(0.1);

    // SEASONS INCREASES FROM 0 TO MAX SEASONS, BOTTOM TO TOP
    originalYScale = d3.scaleBand()
      .domain(episodeData.map(d => d.Season))
      .range([yAxisHeight, 0])
      .padding(0.1);

    frequencyXScale = d3.scaleBand()
        .domain(pairs)
        .range([xAxisXYPos[0], xAxisXYPos[1]])
        .padding(0.1);

    // Create yScale for frequencies
    frequencyYScale = d3.scaleLinear()
        .domain([0, 45])
        .range([yAxisHeight, 0]); 

    ratingXScale = frequencyXScale;

    // Create yScale for ratings
    ratingYScale = d3.scaleLinear()
        .domain([7, 9])
        .range([yAxisHeight, 0]); 
  }

  function showFinaleImages(){
    lastStepImages.forEach((img, index) => {
      img.var.style.zIndex = 5;
      setTimeout(() => {
        img.var.style.opacity = 1; 
      }, index * Constants.transitionTime/2); 
    });
  }

  function hideFinaleImages(){
    lastStepImages.forEach((img, index) => {
      img.var.style.opacity = 0; 
    });
    setTimeout(() => {
      lastStepImages.forEach((img, index) => {
      img.var.style.zIndex = 0; 
    })
    }, Constants.transitionTime);  
    
  }

  /**
   * Reverts axes to original heat map axes
   */
  function heatMapAxes(){
    g.select('.axis-x')
        .transition()
        .duration(Constants.transitionTime)
        .attr('transform', `translate(${xAxisTranslatePos[0]},${xAxisTranslatePos[1]})`)
        .call(d3.axisTop(originalXScale))
        .call(g => g.selectAll(".tick line").remove())
        .call(g => g.select(".domain").remove());
        
        
    // Update y-axis with transition
    yaxis
        .transition()
        .duration(Constants.transitionTime)
        .call(d3.axisLeft(originalYScale))
        .call(g => g.select(".domain").remove()) 
        .call(g => g.selectAll(".tick line").remove());

    // Update x-axis label
    xaxisLabel
        .transition()
        .duration(Constants.transitionTime)
        .attr("x", xAxisLabelXYPos[0])
        .attr("y", xAxisLabelXYPos[1])
        .text("Episode");

    // Update y-axis label
    yaxisLabel
        .transition()
        .duration(Constants.transitionTime)
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
   * helper function to calculate x-position of a rect (with particular data)
   * @param data
   */
  function calculateHeatMapX(data){
    return originalXScale(data.Episode);
  }

  /**
   * helper function to calculate y-position of a rect (with particular data)
   * @param data
   */
  function calculateHeatMapY(data){
    return originalYScale(data.Season) + originalYScale.bandwidth() / 2 - originalXScale.bandwidth() / 2
  }
  

  /**
   * Helper function when index == 1
   */
  function showSpecificSquare() {
    // REMOVING ALL PREVIOUS ADDITIONS
    g.selectAll('.specific-square')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('width', 0)
      .remove(); 

    g.selectAll('.row-group').on('click', null); 
    g.selectAll('.row-group').on('mouseover', null); 
    g.selectAll('.row-group').on('mouseout', null); 
    g.selectAll('.character-image')
    .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove()

    g.selectAll('.legend')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove();

    g.selectAll('.row-group')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('width', 0)
      .remove(); 
    
    g.selectAll('.square rect')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('width', 0)
      .remove(); 

    xaxis
        .call(d3.axisTop(originalXScale))
        .call(g => g.select(".domain").remove()) 
        .call(g => g.selectAll(".tick line").remove());  

    yaxis
      .call(d3.axisLeft(originalYScale))
      .call(g => g.select(".domain").remove()) 
      .call(g => g.selectAll(".tick line").remove());

    // ADDING ONLY THE SQUARE CORRESPONDING TO SEASON 3, EPISODE 6
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
        .attr('class', 'specific-square')
        .attr('x', +specificRect.attr('x'))
        .attr('y', +specificRect.attr('y') + i * rowHeight)
        .attr('width', 0)
        .attr('height', rowHeight)
        .style('fill', Constants.heatMapColors[i])
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

    const transitionTime = Constants.transitionTime;
    const hoverIncrease = 4;

    // REMOVING ALL PREVIOUSLY ADDED 
    g.selectAll('.specific-square')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('width', 0)
      .remove();

    g.selectAll('.legend')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove();

    g.selectAll('.row-group')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('width', 0)
      .remove(); 
    
    g.selectAll('.square rect')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('width', 0)
      .remove(); 

    g.selectAll('.frequency-bar')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('y', yAxisHeight) 
      .attr('height', 0)
      .remove();

    xaxis
      .call(d3.axisTop(originalXScale))
      .call(g => g.select(".domain").remove()) 
      .call(g => g.selectAll(".tick line").remove()); 

    yaxis
      .call(d3.axisLeft(originalYScale))
      .call(g => g.select(".domain").remove()) 
      .call(g => g.selectAll(".tick line").remove());

    // ADDING BASE SQUARES FOR EACH EPISODE
    if(!baseSquares){
      baseSquares = g.append('g')
      .selectAll('.square')
      .data(episodeData)
      .enter().append('rect')
      .attr('class', 'square')
    }
    baseSquares
      .attr('x', d => calculateHeatMapX(d))
      .attr('y', d => calculateHeatMapY(d))
      .attr('width', originalXScale.bandwidth())
      .attr('height', originalXScale.bandwidth())
      .style('fill', 'none')
      .style('opacity', 0);
    
    baseSquares.each(function(d, i) {
      const rect = d3.select(this);
      const numRows = d["Streamlined Characters"].length;
      const rowHeight = originalXScale.bandwidth() / numRows;

      const group = g.append('g')
        .attr('class', 'row-group')
        .datum(d);

      group
        .selectAll('rect')
        .data(d["Streamlined Characters"].map((char, j) => ({
            char,
            index: j,
            Episode: d.Episode, 
            Season: d.Season   
        })))
        .enter().append('rect')
        .attr('x', d => calculateHeatMapX(d))
        .attr('y', d => calculateHeatMapY(d) + (d.index * rowHeight))
        .attr('width', 0)
        .attr('height', rowHeight)
        .style('fill', d => Constants.heatMapColors[d.index])
        .transition()
        .duration(Constants.transitionTime)
        .attrTween("width", function () {
          return d3.interpolate(0, originalXScale.bandwidth());
        });

      let isClicked = false;
      
      group
      .on('mouseover', function() {
        d3.select(this).style("cursor", "pointer");
      });

      group
      .on('mouseout', function() {
        d3.select(this).style("cursor", "default");
      });

      group.on('click', function(event, data) {
        const hoverGroup = d3.select(this);
        const characterGroups = data['Streamlined Characters']; 
        if (!isClicked) {
          const scaledRectWidth = originalXScale.bandwidth() * hoverIncrease;
          const scaledRowHeight = rowHeight * hoverIncrease;

          const newXPos = (d) => {
            return calculateHeatMapX(d) - (originalXScale.bandwidth() * (hoverIncrease - 1)) / 2;
          };
          const newYPos = (d, i) => {
            return calculateHeatMapY(d) + (i * scaledRowHeight) - (rowHeight * (hoverIncrease - 1)) / 2;
          };

          hoverGroup
            .raise()
            .style('cursor', 'pointer')
            .selectAll('rect')
            .transition()
            .duration(transitionTime / 2)
            .attr('width', scaledRectWidth)
            .attr('height', (d, i) => scaledRowHeight)
            .attr('x', d => newXPos(d))
            .attr('y', (d, i) => newYPos(d, i))
            .on('end', function(d, i) {
              addCharacters();
            });

          function addCharacters() {
            hoverGroup.selectAll('rect').each(function(charData, index) {
              const characterNames = charData.char;

              let imageRadius;
              if (characterGroups.length === 1) {
                  imageRadius = scaledRectWidth / (characterNames.length + 3);
              } else {
                  imageRadius = scaledRowHeight / (characterNames.length + 1);
              }

              const characterSpacing = imageRadius / 2;
              const totalCharactersWidth = characterNames.length * (imageRadius * 2 + characterSpacing) - characterSpacing;
              const startX = calculateHeatMapX(d) + (originalXScale.bandwidth() - totalCharactersWidth) / 2;

              characterNames.forEach((name, index) => {
                const imageX = startX + index * (imageRadius * 2 + characterSpacing) + imageRadius;
                const imageY = calculateHeatMapY(d) + (charData.index * rowHeight * hoverIncrease) + rowHeight / 2.5;

                hoverGroup.append('image')
                  .attr('x', imageX - imageRadius)
                  .attr('y', imageY - imageRadius)
                  .attr('width', imageRadius * 2)
                  .attr('height', imageRadius * 2)
                  .attr("opacity", 0)
                  .attr('xlink:href', `assets/yellow-background/${name}.png`)
                  .attr('class', 'character-image')
                  .transition()
                  .duration(Constants.transitionTime)
                  .attr("opacity", 1);
              });
            });
          }
        } else {
          // Second click - Apply the mouseout functionality
          hoverGroup
            // .style('cursor', 'default')
            .selectAll('rect')
            .transition()
            .duration(transitionTime / 2)
            .attr('width', originalXScale.bandwidth())
            .attr('height', rowHeight)
            .attr('x', calculateHeatMapX(d))
            .attr('y', (d, i) => calculateHeatMapY(d) + (i * rowHeight));

          hoverGroup.selectAll('.character-image').remove();
          hoverGroup.selectAll('.character-text').remove();
        }

        // Toggle the state
        isClicked = !isClicked;

      });
    }); 
  }

  /**
   * Helper function when index == 3
   *
   */
  function updateSquaresForTopPairs() {
    g.selectAll('.row-group').on('click', null); 
    g.selectAll('.row-group').on('mouseover', null); 
    g.selectAll('.row-group').on('mouseout', null); 
    g.selectAll('.character-image')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove()

    g.selectAll('.frequency-bar')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('y', yAxisHeight) 
      .attr('height', 0)
      .remove();

    g.selectAll('.row-group')
      .selectAll('rect')
      .transition()
      .style('opacity', 1)
      

    g.selectAll('.frequency-label')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove();

    xaxis
      .selectAll('image')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove();

    heatMapAxes();

    const currentDomain = xaxis.selectAll('.tick').data();

    // Compare current domain with new domain
    if (JSON.stringify(currentDomain) === JSON.stringify(frequencyXScale.domain())) {
        // Revert axes if the current domain matches the new xScale domain
        heatMapAxes();
    } 
  
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
          .delay(Constants.transitionTime/2)
          .duration(Constants.transitionTime)
          .attr('x', (d) => calculateHeatMapX(d))
          .attr('y', (d, i, nodes) => calculateHeatMapY(d) + (i * originalXScale.bandwidth()) / nodes.length)
          .attr('width', originalXScale.bandwidth())
          .attr('height', (d, i, nodes) => originalXScale.bandwidth() / nodes.length)
          .style('fill', d => {
              const pair = d.char;
              return pairToColor.get(pairToString(pair)) || Constants.yellowColor;
          });
      });

    g.selectAll('.legend')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('width', 0)
      .remove();

    // Create legend
    legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${chartWidth - 5 * originalXScale.bandwidth()*2}, 0)`)
      .style('opacity', 0);// Adjust position as needed

    let legendIndex = 0;
    pairToColor.forEach((color, pair) => {
        const pairText = pair.replace(' & ', '-').toLowerCase();
        const pairImage = `assets/legend/${pairText}.png`; // Assuming you have saved the images with the pair names

        const row = Math.floor(legendIndex / 5);
        const col = legendIndex % 5;
        const xOffset = originalXScale.bandwidth()/4 + col * originalXScale.bandwidth()*2; // Adjust spacing as needed
        const yOffset = 10 + row * originalXScale.bandwidth(); // Adjust spacing as needed

        const legendItem = legend.append('g')
            .attr('class', 'legend-item')
            .attr('transform', `translate(${xOffset}, ${yOffset})`);

        legendItem.append('image')
            .attr('x', 0)
            .attr('y', 0)
            // .attr('width', originalXScale.bandwidth()*1.5)
            .attr('height', originalXScale.bandwidth() * 0.75)
            .attr('xlink:href', pairImage);

        legendIndex++;
    });


    legend
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 1);
  }

  /**
   * Helper function when index == 4
   */
  function createStackedBarChart(){

    g.selectAll('.row-group')
      .selectAll('rect')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 1); 
      
    g.selectAll('.frequency-bar')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .attr('y', yAxisHeight) 
      .attr('height', 0)
      .remove();

    g.selectAll('.frequency-label')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove();

    g.selectAll('.legend')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0)
      .remove();

    // Update x-axis
    xaxis
        .transition()
        .duration(Constants.transitionTime)
        .call(d3.axisBottom(frequencyXScale))
        .attr('transform', `translate(0,${yAxisHeight})`)
        .call(g => g.selectAll(".tick line").remove()); 
    
    // Remove existing labels if any
    xaxis.selectAll('text').remove();

    // Append image elements as labels
    xaxis.selectAll('image')
        .data(topPairs)
        .enter()
        .append('image')
        .attr("opacity", 0)
        .attr('x', d => frequencyXScale(d) + frequencyXScale.bandwidth()/4)
        .attr('y', 4)
        .attr('width', frequencyXScale.bandwidth()/2) 
        // .attr('height', 36) 
        .attr('xlink:href', d => `assets/legend/${d.replace(' & ', '-').toLowerCase()}.png`) // Path to the image
        .attr('class', 'x-axis-label-image')
        .transition()
        .duration(Constants.transitionTime)
        .attr("opacity", 1); // Assign a class for further styling if needed
        

        // Update x-axis label
     xaxisLabel
        .transition()
        .duration(Constants.transitionTime)
        .attr("x", xAxisLabelXYPos[0])
        .attr("y", xAxisLabelXYPos[1])
        .text("Top Character Pairs");

    // Update y-axis with transition
    yaxis
        .transition()
        .duration(Constants.transitionTime)
        .call(d3.axisLeft(frequencyYScale))
        .call(g => g.selectAll(".tick line").remove());
     
    // Update y-axis label
   yaxisLabel
        .transition()
        .duration(Constants.transitionTime)
        .text("Number of Appearances"); 

    // Move the remaining rects to the appropriate position in the new scale
      g.selectAll('.row-group')
        .selectAll('rect')
        .filter(function(d) {
            const pair = d.char;
            return topPairs.some(topPair => topPair === pairToString(pair));
        })
        .transition()
        .duration(Constants.transitionTime*2)
        .attr('x', d => frequencyXScale(pairToString(d.char)) + frequencyXScale.bandwidth()/4)
        .attr('y', yAxisHeight - 11)
        .attr('width', frequencyXScale.bandwidth()/2 - 2)
        .attr('height', 10)
        // .attr("opacity", 1)
        .on('end', function(d, i) {
          addFrequencyBars(); 
          });


    function addFrequencyBars() {
      g.selectAll('.frequency-bar')
        .data(sortedCharacterRatingArray.slice(0, 10))
        .enter().append('rect')
        .attr('class', 'frequency-bar')
        .attr('x', d => frequencyXScale(pairToString(d.pair)) + frequencyXScale.bandwidth()/4)
        .attr('y', yAxisHeight) 
        .attr('width', frequencyXScale.bandwidth()/2)
        .attr('height', 0) 
        .style('fill', d => pairToColor.get(pairToString(d.pair)))
        .transition()
        .duration(Constants.transitionTime)
        .attr('y', d => frequencyYScale(d.frequency))
        .attr('height', d => yAxisHeight - frequencyYScale(d.frequency))
        .on('end', function(d, i) {
          g.selectAll('.frequency-label')
            .data(sortedCharacterRatingArray.slice(0, 10))
            .enter().append('text')
            .attr('class', 'frequency-label')
            .attr('x', d => frequencyXScale(pairToString(d.pair)) + frequencyXScale.bandwidth() / 2)
            .attr('y', d => frequencyYScale(d.frequency) - 5)  // Position the label just above the bar
            .attr('text-anchor', 'middle')
            .style('font-size', Constants.labelFontSize)
            .style('opacity', 0)  // Start with opacity 0 for transition
            .text(d => d.frequency)
            .transition()
            .duration(Constants.transitionTime)
            .style('opacity', 1); 
        });
    }

  }

  /**
   * Helper function when index == 5
   */
  function highlightHighestFrequencyBar(){
    const winningPair = pairToString(sortedCharacterRatingArray.slice(0, 10).reduce((max, obj) => (obj.frequency > max.frequency ? obj : max)).pair)

    xaxis
        .transition()
        .duration(Constants.transitionTime)
        .call(d3.axisBottom(frequencyXScale))
        .attr('transform', `translate(0,${yAxisHeight})`)
        .call(g => g.selectAll(".tick line").remove()); 

    yaxis
      .transition()
      .duration(Constants.transitionTime)
      .call(d3.axisLeft(frequencyYScale))
      .call(g => g.selectAll(".tick line").remove());

    g.selectAll('.row-group')
      .selectAll('rect')
      .transition()
      .style('opacity', 0); 

    g.selectAll('.frequency-bar')
      .transition()
      .duration(Constants.transitionTime)
      .attr('x', d => frequencyXScale(pairToString(d.pair)) + frequencyXScale.bandwidth()/4)
      .attr('y', d => frequencyYScale(d.frequency))
      .attr('width', frequencyXScale.bandwidth()/2)
      .attr('height', d => yAxisHeight - frequencyYScale(d.frequency))
      .style('opacity', function(d) {
        return pairToString(d.pair) === winningPair ? 1 : 0.1;
      });

    g.selectAll('.frequency-label')
      .transition()
      .duration(Constants.transitionTime)
      .attr('x', d => frequencyXScale(pairToString(d.pair)) + frequencyXScale.bandwidth() / 2)
      .attr('y', d => frequencyYScale(d.frequency) - 5) 
      .style('opacity', function(d) {
        return pairToString(d.pair) === winningPair ? 1 : 0.1;
    });

  }

  /**
   * Helper function when index == 6
   */
  function createRatingBarChart(){
    g.selectAll('.frequency-label')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 0); 
    
    g.selectAll('.row-group')
      .transition()
      .duration(Constants.transitionTime)
      .style('opacity', 1); 

    xaxis
      .transition()
      .duration(Constants.transitionTime)
      .call(d3.axisBottom(ratingXScale))
      .attr('transform', `translate(0,${yAxisHeight})`)
      .call(g => g.selectAll(".tick line").remove()); 

    // Update y-axis with transition
    yaxis
        .transition()
        .duration(Constants.transitionTime)
        .call(d3.axisLeft(ratingYScale))
        .call(g => g.selectAll(".tick line").remove());
     
    // Update y-axis label
    yaxisLabel
        .transition()
        .duration(Constants.transitionTime)
        .text("Average Rating"); 

    g.selectAll('.frequency-bar')
        .transition()
        .duration(Constants.transitionTime)
        .attr('x', d => ratingXScale(pairToString(d.pair)) + ratingXScale.bandwidth()/4)
        .attr('y', d => ratingYScale(d.averageCumulativeRating))
        .attr('width', ratingXScale.bandwidth()/2)
        .attr('height', d => yAxisHeight - ratingYScale(d.averageCumulativeRating))
        .style('opacity', 1); 
        // .on('end', function(d, i) { 
    g.selectAll('.frequency-label')
      .transition()
      .duration(Constants.transitionTime*2)
      .attr('x', d => ratingXScale(pairToString(d.pair)) + ratingXScale.bandwidth()/2)
      .attr('y', d => ratingYScale(d.averageCumulativeRating) - 5)
      .text(d => d.averageCumulativeRating.toFixed(2))
      .style('opacity', 1); 
        // }); 
  }

  /**
   * helper function when index == 7
   */
  function highlightWinningBar() {
    const winningPair = pairToString(sortedCharacterRatingArray.slice(0, 10).reduce((max, obj) => (obj.averageCumulativeRating > max.averageCumulativeRating ? obj : max)).pair); 
    // Adjust this to match the exact format used in your data

    xaxis
      .transition()
      .duration(Constants.transitionTime)
      .call(d3.axisBottom(ratingXScale))
      .attr('transform', `translate(0,${yAxisHeight})`)
      .call(g => g.selectAll(".tick line").remove()); 

    yaxis
      .transition()
      .duration(Constants.transitionTime)
      .call(d3.axisLeft(ratingYScale))
      .call(g => g.selectAll(".tick line").remove());

    g.selectAll('.row-group')
      .style('opacity', 0); 

    g.selectAll('.frequency-bar')
      .transition()
      .duration(Constants.transitionTime)
      .attr('x', d => ratingXScale(pairToString(d.pair)) + ratingXScale.bandwidth()/4)
      .attr('y', d => ratingYScale(d.averageCumulativeRating))
      .attr('width', ratingXScale.bandwidth()/2)
      .attr('height', d => yAxisHeight - ratingYScale(d.averageCumulativeRating))
      .style('opacity', function(d) {
        return pairToString(d.pair) === winningPair ? 1 : 0.1;
      });

    g.selectAll('.frequency-label')
      .transition()
      .duration(Constants.transitionTime)
      .attr('x', d => ratingXScale(pairToString(d.pair)) + ratingXScale.bandwidth()/2)
      .attr('y', d => ratingYScale(d.averageCumulativeRating) - 5)
      .style('opacity', function(d) {
        return pairToString(d.pair) === winningPair ? 1 : 0.1;
      });

  }

  // Call the updateHeatMap function based on the index value
  $: {
    if(g) {
      if (index == 1) {
        showSpecificSquare();
        document.getElementById("instruction").style.opacity = 0;
      } else if (index == 2) {
        showAllSquares();
        document.getElementById("instruction").style.opacity = 1; 
      } else if (index == 3) {
        updateSquaresForTopPairs();
        document.getElementById("instruction").style.opacity = 0; 
      } else if (index == 4) {
        createStackedBarChart();
      } else if (index == 5){
        highlightHighestFrequencyBar(); 
      } else if (index == 6) {
        createRatingBarChart();
      } else if (index == 7) {
        highlightWinningBar();
        hideFinaleImages(); 
      } else if (index == 8) {
        showFinaleImages(); 
      }
    }
  }

  onMount(() => {

    window.addEventListener('resize', () => {
      svgWidth = 0.9 * window.innerWidth;
      svgHeight = 0.9 * window.innerHeight;

      chartWidth = svgWidth - margin.left - margin.right;
      chartHeight = svgHeight - margin.top - margin.bottom;
      
      xAxisTranslatePos = [0, chartHeight - pageMarginInPixels]; 
      xAxisXYPos = [pageMarginInPixels*2, chartWidth]; 
      xAxisWidth = xAxisXYPos[1] - xAxisXYPos[0];
      xAxisLabelXYPos = [margin.left + xAxisWidth / 2, chartHeight+7]; 

      yAxisTranslatePos = [pageMarginInPixels*2, 0]; 
      yAxisXYPos = [pageMarginInPixels*2, chartHeight-5]; 
      yAxisHeight = yAxisXYPos[1] - yAxisXYPos[0]; 
      yAxisLabelTranslatePos = [0, pageMarginInPixels*2];

      xaxis
        .transition()
        .attr('transform', `translate(${xAxisTranslatePos[0]},${xAxisTranslatePos[1]})`); 
      
      yaxis
        .transition()
        .attr('transform', `translate(${yAxisTranslatePos[0]},${yAxisTranslatePos[1]})`); 
      
      xaxisLabel  
          .transition()  
          .attr("x", xAxisLabelXYPos[0])
          .attr("y", xAxisLabelXYPos[1])
      
      yaxisLabel  
        .transition()  
        .attr("x", yAxisLabelTranslatePos[0])
        .attr("y", yAxisLabelTranslatePos[1] - originalXScale.bandwidth())

      xaxis.selectAll('image')
        .transition()
        .attr('x', d => frequencyXScale(d) + frequencyXScale.bandwidth()/4)
        .attr('y', 4)
        .attr('width', frequencyXScale.bandwidth()/2); 

      setScales(topPairs); 
        
      if (index == 1) {
        showSpecificSquare();
      } else if (index == 2) {
        showAllSquares();
      } else if (index == 3) {
        updateSquaresForTopPairs();
      } else if (index == 4) {
        createStackedBarChart();
      } else if (index == 5){
        highlightHighestFrequencyBar(); 
      } else if (index == 6) {
        createRatingBarChart();
      } else if (index == 7) {
        highlightWinningBar();
        hideFinaleImages(); 
      } else if (index == 8) {
        showFinaleImages(); 
      }

      
        
    }); 
  }); 

</script>

<section bind:this={heatMapSection} class="heatmap-section">
      <div class="svg-container divBorder">
          <img id="heatmap-pin1" src="/assets/pins/pin.svg" alt="thumb pin" class="thumb-pin"/>
          <img id="heatmap-pin2" src="/assets/pins/pin.svg" alt="thumb pin" class="thumb-pin"/>
          <img id="heatmap-pin3" src="/assets/pins/pin.svg" alt="thumb pin" class="thumb-pin"/>
          <img id="heatmap-pin4" src="/assets/pins/pin.svg" alt="thumb pin" class="thumb-pin"/>
          <svg bind:this={heatMapSvg} width={svgWidth} height={svgHeight} viewBox="0 0 {svgWidth} {svgHeight}" class="heatmap-svg"></svg>
      </div>
      <div class="heatmap-content">
        <img id="heatmap-content-pin" src="/assets/pins/orange-pin.svg" alt="thumb pin" class="thumb-pin"/>
        {@html Constants.heatMapSectionText[index]}
      </div>
      <div id="instruction">
        <img id="instruction-pin" src="/assets/pins/orange-pin.svg" alt="thumb pin" class="thumb-pin"/>
        Click on an episode to know more, or arrow-right to move ahead!
      </div>
      {#each lastStepImages as image, i}
        <div bind:this={image.var} class="character-containers divBorder finaleImages" id={image.id}>
          <img src="/assets/pins/orange-pin.svg" alt="thumb pin" class="thumb-pin"/>
          <img src={image.src} alt={image.alt}/>
        </div>
      {/each}
</section>
  
<style>
    .finaleImages {
      z-index: 0; 
      opacity: 0; 
      transition: opacity var(--transition-time); 
    }

    .heatmap-section{
      width: 100vw; 
      height: 100vh; 
      position: relative; 
      display: flex; 
      align-items: center;
      justify-content: center;
    }

    .svg-container {
      z-index: 1; 
      width: fit-content; 
      height: fit-content; 
      position: absolute; 
      background-color: var(--white); 
    }

    #img1 {
      top: 23vh; 
      left: 30vw; 
    }
    
    #img1  img:nth-of-type(2){
      width: 27vw; 
    }

    #img2 {
      top: 10vh; 
      left: 70vw; 
    }

    #img2  img:nth-of-type(2){
      width: 25vw; 
    }

    #img3 {
      top: 2vh; 
      left: 48vw; 
    }

    #img3  img:nth-of-type(2){
      width: 25vw; 
    }

    #img4 {
      top: 48vh; 
      left: 70vw; 
    }

    #img4  img:nth-of-type(2){
      width: 27vw; 
    }

    #img5 {
      top: 4vh; 
      left: 24vw; 
    }

    #img5  img:nth-of-type(2){
      width: 25vw; 
    }

    #img6 {
      top: 12vh; 
      left: 5vw; 
    }

    #img6  img:nth-of-type(2){
      width: 25vw; 
    }

    #img7 {
      top: 60vh; 
      left: 44vw; 
    }

    #img7  img:nth-of-type(2){
      width: 30vw; 
    }

    #img8 {
      top: 35vh; 
      left: 8vw; 
    }

    #img8  img:nth-of-type(2){
      width: 25vw; 
    }

    #img9 {
      top: 65vh; 
      left: 3vw; 
    }

    #img9  img:nth-of-type(2){
      width: 27vw; 
    }

    #heatmap-pin1 {
      top: -0.5rem; 
      left: 0; 
    }

    #heatmap-pin2 {
      top: -0.5rem; 
      left: 100%; 
    }

    #heatmap-pin3 {
      top: 99%; 
      left: 0; 
    }

    #heatmap-pin4 {
      top: 99%;  
      left: 100%; 
    }

    .heatmap-content {
      z-index: 2; 
      position: absolute;  
      background-color: var(--yellow); 
      width: 25vw; 
      padding: var(--margin); 
      height: 16vh; 
      top: 3vh; 
      left: 25vw; 
    }

    #instruction {
      z-index: 2; 
      position: absolute; 
      background-color: var(--green); 
      width: 15vw; 
      padding: var(--margin); 
      vertical-align: middle;
      text-align: center;
      top: 3vh; 
      left: 53vw; 
      opacity: 0;
      transition: opacity var(--transition-time);
    }

    #heatmap-content-pin{
      top: -0.5rem; 
      left: 50%; 
    }

    #instruction-pin{
      top: -0.5rem; 
      left: 50%; 
    }


</style>
    