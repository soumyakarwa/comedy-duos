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

    // svg.append('rect').attr('x', 0).attr('y', 0).attr('width', svgWidth).attr('height', svgHeight).attr('fill', Constants.whiteColor); 

    const caseImgHeight =  svgHeight * 0.07;
    const caseImgX =  svgWidth * 0.02; 
    const caseImgY =  svgHeight * 0.045;
    const caseBottomPin1 = [caseImgX*7.5, caseImgY + caseImgHeight]; 
    const caseTopPin1 = [caseImgX*6, caseImgY]; 

    const titleImgWidth = svgWidth * 0.6; 
    const titleImgX = svgWidth*0.215; 
    const titleImgY = svgHeight * 0.285; 
    const titleTopPin1 = [titleImgX + svgWidth*0.206, titleImgY]; 
    const titleTopPin2 = [titleImgX + titleImgWidth - 4, titleImgY]; 
    const titleBottomPin1 = [svgWidth * 0.34, titleImgY + svgHeight*0.46];
    const titleBottomPin2 = [titleImgX + titleImgWidth - 4, titleImgY + svgHeight*0.46];

    const detectiveImgHeight = svgHeight * 0.09;
    const detectiveImgX = svgWidth*0.88; 
    const detectiveImgY = svgHeight * 0.88; 
    const detectiveTopPin1 = [detectiveImgX + svgWidth*0.047, detectiveImgY];

    const caseImg = svg.append("image")
        .attr("xlink:href", "/assets/caseText.svg") 
        .attr("x", caseImgX) 
        .attr("y", caseImgY)
        .attr("height", caseImgHeight);

    const titleImg = svg.append("image")
       .attr("xlink:href", "/assets/title.svg") 
       .attr("x", titleImgX) 
       .attr("y", titleImgY)
       .attr("width", titleImgWidth);   

    const detectiveImg = svg.append("image")
    .attr("xlink:href", "/assets/detective.svg") 
    .attr("x", detectiveImgX) 
    .attr("y", detectiveImgY)
    .attr("height", detectiveImgHeight); 

    createThumbPin(svg, caseBottomPin1); 
    createThumbPin(svg, caseTopPin1); 
    createThumbPin(svg, titleTopPin1);    
    createThumbPin(svg, titleTopPin2); 
    createThumbPin(svg, titleBottomPin1);       
    createThumbPin(svg, titleBottomPin2);    
    createThumbPin(svg, detectiveTopPin1);    
    createLine(svg, caseBottomPin1, titleTopPin1, Math.random() * Constants.maxLineDelay); 
    createLine(svg, titleTopPin2, [svgWidth, 0],  Math.random() * Constants.maxLineDelay); 
    createLine(svg, titleBottomPin1, [svgWidth*0.45, svgHeight],  Math.random() * Constants.maxLineDelay); 
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


<!-- <div class="case-container">
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-top-1"/>
    <div id="case">CASE: 725ZA-52ZN</div>
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-bottom-1"/>
  </div>
  <div class="title-container">
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-top-1"/>
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-top-2"/>
    <div class="title">THE MOST ICONIC DUO IN</div>
    <div class="subtitle">BROOKLYN<br><span class="hel">NINE-NINE</span><br></div>
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-bottom-1"/>
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-bottom-2"/>
  </div>
  <div class="name-container">
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-top-1"/>
    <div id="case-detective">CASE DETECTIVE<br>Soumya Karwa</div>
  </div> -->

<!-- <style>
  .landing-page-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    /* background-color: white; */
  }

  /* FOR TOP LEFT HAND CORNER DIV */
  .case-container {
    background-color: var(--white); 
    padding: calc(var(--margin)/2); 
    align-self: flex-start;
    margin-top: calc(var(--margin)*2); 
    margin-left: calc(var(--margin)*2); 
    position: relative; /* Ensure the thumb pin is positioned relative to this container */
  }

  .case-container #case-pin-top-1 {
    top: -0.5rem; 
    left: 47%; 
  }

  .case-container #case-pin-bottom-1 {
    top: 5rem; 
    left: 92%; 
  }

  #case {
    font-size: calc(var(--title-font-size) * 6/10); 
    font-family: "Impact"; 
  }

  /* FOR CENTER DIV */
  .title-container {
    background-color: var(--white);
    padding: calc(var(--margin)/2) var(--margin); 
    position: relative; /* Ensure the thumb pin is positioned relative to this container */
  }

  .title {
    /* font-size 5.5rem;  */
    font-size: var(--title-font-size);
    font-family: "Impact"; 
    margin-bottom: var(--margin); 
  }

  .subtitle {
    /* font-size: 9.5rem; */
    font-size: calc(var(--title-font-size) * 9.5/5.5); 
    color: var(--yellow); /* Gold color */
    font-family: "Impact";
    line-height: 0.6; 
    margin-bottom: calc(var(--margin)*1.5);
  }

  .hel {
    /* font-size: 7.32rem;  */
    font-size: calc(var(--title-font-size) * 7.32/5.5); 
    font-family: "Helvetica Neue";
    font-weight: bold;
  }

  .title-container #case-pin-top-1 {
    top: -0.5rem; 
    left: 37.75%; 
  }

  .title-container #case-pin-top-2 {
    top: -0.5rem; 
    left: 99.75%; 
  }

  .title-container #case-pin-bottom-1 {
    top: 97.5%; 
    left: 45%; 
  }

  .title-container #case-pin-bottom-2 {
    top: 97.5%; 
    left: 99.75%; 
  }

  /* FOR BOTTOM RIGHT HAND CORNER DIV */
  .name-container {
    background-color: var(--white); 
    padding: calc(var(--margin)/2); 
    align-self: flex-end;
    margin-bottom: calc(var(--margin)*2); 
    margin-right: calc(var(--margin)*2); 
    position: relative;
  }

  #case-detective {
    font-size: var(--body-font-size); 
    font-family: "Impact"; 
  }

  .name-container #case-pin-top-1 {
    top: -0.5rem; 
    left: 45%; 
  }


</style>
 -->
