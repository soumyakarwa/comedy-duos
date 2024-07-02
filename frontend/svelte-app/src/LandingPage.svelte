<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import * as Constants from "./Constants.js";
  import {createLine, createThumbPin, setSvgDimensions} from "./Util.js"
  
  let landingPageSvg;
  let svgWidth, svgHeight; 

  onMount(async () => {
    const svg = d3.select(landingPageSvg);
    
    [svgWidth, svgHeight] = setSvgDimensions("landing", svg); 

    const caseImgHeight =  svgHeight * 0.07;
    const caseImgX =  svgWidth * 0.02; 
    const caseImgY =  svgHeight * 0.045;
    const caseBottomPin1 = [caseImgX*7.5, caseImgY + caseImgHeight]; 
    const caseTopPin1 = [caseImgX*6, caseImgY]; 

    const titleImgRatio = 1011/435; 
    const titleImgHeight = svgHeight * 0.46;
    const titleImgWidth = titleImgRatio * titleImgHeight; 
    const titleImgX = svgWidth*0.215; 
    const titleImgY = svgHeight * 0.285; 
    const titleTopPin1 = [titleImgX + 0.3*titleImgWidth, titleImgY]; 
    const titleTopPin2 = [titleImgX + titleImgWidth - 4, titleImgY]; 
    const titleBottomPin1 = [titleImgX + 0.2*titleImgWidth, titleImgY + titleImgHeight];
    const titleBottomPin2 = [titleImgX + titleImgWidth - 6, titleImgY + titleImgHeight];

    const detectiveImgHeight = svgHeight * 0.09;
    const detectiveImgX = svgWidth*0.88; 
    const detectiveImgY = svgHeight * 0.88; 
    const detectiveTopPin1 = [detectiveImgX + svgWidth*0.047, detectiveImgY];

    const arrowImgRatio = 169/88.41; 
    const arrowImgHeight = titleImgHeight * 0.2; 
    const arrowImgWidth = arrowImgHeight*arrowImgRatio; 
    const arrowImgX = titleImgX + titleImgWidth + 10; 
    const arrowImgY = titleImgY + titleImgHeight - arrowImgHeight; 
    const arrowPin = [arrowImgX + arrowImgWidth/2, arrowImgY];

    const caseImg = svg.append("image")
        .attr("xlink:href", "/assets/caseText.svg") 
        .attr("x", caseImgX) 
        .attr("y", caseImgY)
        .attr("height", caseImgHeight);

    const titleImg = svg.append("image")
       .attr("xlink:href", "/assets/title.svg") 
       .attr("x", titleImgX) 
       .attr("y", titleImgY)
      //  .attr("width", titleImgWidth);   
       .attr("height", titleImgHeight);

    const detectiveImg = svg.append("image")
    .attr("xlink:href", "/assets/detective.svg") 
    .attr("x", detectiveImgX) 
    .attr("y", detectiveImgY)
    .attr("height", detectiveImgHeight); 

    setTimeout(() => {
      const arrowKeyImg = svg.append("image")
        .attr("xlink:href", "/assets/arrows.svg")
        .attr("x", arrowImgX) 
        .attr("y", arrowImgY)
        .attr("height", arrowImgHeight)
        .attr("opacity", 0)
        .transition()
        .duration(Constants.transitionTime)
        .attr("opacity", 1); 
      createThumbPin(svg, arrowPin); 
    }, Constants.maxLineDelay*3);    

    createThumbPin(svg, caseBottomPin1); 
    createThumbPin(svg, caseTopPin1); 
    createThumbPin(svg, titleTopPin1);    
    createThumbPin(svg, titleTopPin2); 
    createThumbPin(svg, titleBottomPin1);       
    createThumbPin(svg, titleBottomPin2);    
    createThumbPin(svg, detectiveTopPin1);    
    createLine(svg, caseBottomPin1, titleTopPin1, Math.random() * Constants.maxLineDelay); 
    createLine(svg, titleTopPin2, [svgWidth, 0],  Math.random() * Constants.maxLineDelay); 
    createLine(svg, titleBottomPin1, [svgWidth*0.47, svgHeight],  Math.random() * Constants.maxLineDelay); 
    createLine(svg, titleBottomPin2, detectiveTopPin1,  Math.random() * Constants.maxLineDelay); 

    // Update positioning on window resize
    window.addEventListener('resize', () => {
      [svgWidth, svgHeight] = setSvgDimensions("landing", svg); 
    });
  });
</script>

<div class="landing-page-container" id="landing">
  <svg bind:this={landingPageSvg}></svg>
</div>


<style>
  .landing-page-container {
    width: 100vw;
    height: 100vh;
  }

  svg {
    display: block;
  }
</style>
