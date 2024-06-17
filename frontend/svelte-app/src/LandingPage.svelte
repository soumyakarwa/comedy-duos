<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import * as Constants from "./Constants.js";
  import {createLine, createThumbPin} from "./Util.js"
  
  let landingPageSvg;

  onMount(async () => {
    const svg = d3.select(landingPageSvg);

    // Set width and height based on the container
    function setSvgDimensions() {
      const container = document.querySelector('.landing-page-container');
      const width = container.clientWidth;
      const height = container.clientHeight;

      svg.attr('width', width)
         .attr('height', height);

      return [width, height]
    }

    let [svgWidth, svgHeight] = setSvgDimensions();

    const caseImgHeight =  svgHeight * 0.1;
    const caseImgX =  svgWidth * 0.03; 
    const caseImgY =  svgHeight * 0.047; 
    const caseBottomPin1 = [caseImgX*7.25, caseImgY + caseImgHeight]; 

    const titleImgWidth = svgWidth * 0.7; 
    const titleImgX = svgWidth*0.215; 
    const titleImgY = svgHeight * 0.29; 
    const titleTopPin1 = [titleImgX + svgWidth*0.206, titleImgY]; 

    const detectiveImgHeight = svgHeight * 0.04;
    const detectiveImgX = svgWidth*0.935; 
    const detectiveImgY = svgHeight * 0.935; 

    svg.append("image")
        .attr("xlink:href", "/assets/caseText.svg") 
        .attr("x", caseImgX) 
        .attr("y", caseImgY)
        .attr("height", caseImgHeight);

    svg.append("image")
       .attr("xlink:href", "/assets/title.svg") 
       .attr("x", titleImgX) 
       .attr("y", titleImgY)
       .attr("width", titleImgWidth);  

    svg.append("image")
       .attr("xlink:href", "/assets/detective.svg") 
       .attr("x", detectiveImgX) 
       .attr("y", detectiveImgY)
       .attr("Height", detectiveImgHeight); 

    createThumbPin(svg, caseBottomPin1); 
    createThumbPin(svg, titleTopPin1);    
    createLine(svg,caseBottomPin1, titleTopPin1); 

    // Update positioning on window resize
    window.addEventListener('resize', () => {
      [svgWidth, svgHeight] = setSvgDimensions();      
    });
  });
</script>

<div class="landing-page-container">
  <svg bind:this={landingPageSvg} viewBox="0 0 1600 900" preserveAspectRatio="xMinYMin meet"></svg>
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
