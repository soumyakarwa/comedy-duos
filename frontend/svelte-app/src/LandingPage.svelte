<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import * as Constants from "./Constants.js";
  import {createLine, createThumbPin, setSvgDimensions} from "./Util.js"
  
  let landingPageSvg;
  let svgWidth, svgHeight; 
  export let sectionIndex;
  let caseImg, detectiveImg, arrowKeyImg, titleImg;  

  let caseImageData = {
    img: null,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    topPins: {ellipse: null, pos: null}, 
    bottomPins: {ellipse: null, pos: null}
  };

  let detectiveImgData = {
    img: null,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    bottomPins: null,
    topPins: null
  };

  let arrowImgData = {
    img: null,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    bottomPins: null,
    topPins: null
  };

  let titleImgData = {
    img: null,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    bottomPins: null,
    topPins: null
  };


  function setPosition(svg, svgWidth, svgHeight){
    caseImageData.height = svgHeight * 0.07;
    caseImageData.x = svgWidth * 0.02;
    caseImageData.y =  svgHeight * 0.045;
    caseImageData.topPins.pos = [caseImageData.x*6, caseImageData.y]; 
    caseImageData.bottomPins.pos = [caseImageData.x*7.5, caseImageData.y  + caseImageData.height]; 

    detectiveImgData.height = svgHeight * 0.09;
    detectiveImgData.x = svgWidth*0.88; 
    detectiveImgData.y = svgHeight * 0.88; 
    detectiveImgData.topPins = [detectiveImgData.x + svgWidth*0.047, detectiveImgData.y];

    titleImgData.height = svgHeight * 0.46;
    titleImgData.width = 1011/435 * titleImgData.height; 
    titleImgData.x = svgWidth*0.215; 
    titleImgData.y = svgHeight * 0.285; 
    titleImgData.topPins = [
      [titleImgData.x + 0.3*titleImgData.width, titleImgData.y], 
      [titleImgData.x+ titleImgData.width - 4, titleImgData.y]
    ]; 
    titleImgData.bottomPins = [
      [titleImgData.x + 0.2*titleImgData.width, titleImgData.y + titleImgData.height],
      [titleImgData.x + titleImgData.width - 6, titleImgData.y + titleImgData.height]
    ];

    arrowImgData.height = titleImgData.height * 0.2; 
    arrowImgData.width = arrowImgData.height*169/88.41; 
    arrowImgData.x = titleImgData.x + titleImgData.width + 10; 
    arrowImgData.y = titleImgData.y + titleImgData.height - arrowImgData.height; 
    arrowImgData.topPins = [arrowImgData.x + arrowImgData.width/2, arrowImgData.y];

  }

  function setup(svg, svgWidth, svgHeight) {

    setPosition(svg, svgWidth, svgHeight);
   
    if(!caseImageData.img){
      caseImageData.img = svg.append("image")
        .attr("xlink:href", "/assets/landing-page/caseTextWithBorder.svg") 
    }
    
    caseImageData.img.attr("x", caseImageData.x) 
        .attr("y", caseImageData.y)
        .attr("height", caseImageData.height);

    if(!titleImgData.img){
      titleImgData.img = svg.append("image")
       .attr("xlink:href", "/assets/landing-page/titleWithBorder.svg") ; 
    }
    titleImgData.img
       .attr("x", titleImgData.x) 
       .attr("y",titleImgData.y)
      //  .attr("width", titleImgWidth);   
       .attr("height", titleImgData.height);

    if(!detectiveImgData.img){
      detectiveImgData.img = svg.append("image")
      .attr("xlink:href", "/assets/landing-page/detectiveWithBorder.svg") 
    }
    detectiveImgData.img
    .attr("x", detectiveImgData.x) 
    .attr("y", detectiveImgData.y)
    .attr("height", detectiveImgData.height); 

    setTimeout(() => {
      if(!arrowImgData.img){
        arrowImgData.img = svg.append("image")
        .attr("xlink:href", "/assets/landing-page/arrowsWithBorder.svg")
      }
      arrowImgData.img
        .attr("x", arrowImgData.x) 
        .attr("y", arrowImgData.y)
        .attr("height", arrowImgData.height)
        .attr("opacity", 0)
        .transition()
        .duration(Constants.transitionTime)
        .attr("opacity", 1); 
      createThumbPin(svg, arrowImgData.topPins); 
    }, Constants.maxLineDelay*5);    
   
    createThumbPin(svg, caseImageData.topPins.pos); 
    
    setTimeout(() => {
      createThumbPin(svg, caseImageData.bottomPins.pos); 
      createThumbPin(svg, titleImgData.topPins[0]);    
      setTimeout(() => {
      createLine(svg, caseImageData.bottomPins.pos, titleImgData.topPins[0], 0)
      }, Constants.maxLineDelay/2); 
    }, Constants.maxLineDelay); 
    
    setTimeout(() => {
      createThumbPin(svg, titleImgData.topPins[1]); 
      setTimeout(() => {
        createLine(svg, titleImgData.topPins[1], [svgWidth, 0],  0)
      }, Constants.maxLineDelay/2); 
    }, Constants.maxLineDelay*2); 
    
    setTimeout(() => {
      createThumbPin(svg, titleImgData.bottomPins[0]);     
      setTimeout(() => {
        createLine(svg, titleImgData.bottomPins[0], [svgWidth*0.455, svgHeight],  0)
      }, Constants.maxLineDelay/2); 
    }, Constants.maxLineDelay*4);
    
    setTimeout(() => {
      createThumbPin(svg, titleImgData.bottomPins[1]);  
      createThumbPin(svg, detectiveImgData.topPins);  
      setTimeout(() => {    
        createLine(svg, titleImgData.bottomPins[1], detectiveImgData.topPins,  0); 
      }, Constants.maxLineDelay/2); 
    }, Constants.maxLineDelay*3);
  }

  onMount(async () => {
    const svg = d3.select(landingPageSvg);
    
    // [svgWidth, svgHeight] = setSvgDimensions("landing", svg); 
    svgWidth = document.getElementById('landing').getBoundingClientRect().width; 
    svgHeight = document.getElementById('landing').getBoundingClientRect().height; 

    setup(svg, svgWidth, svgHeight); 

    window.addEventListener('resize', () => {
      svgWidth = document.getElementById('landing').getBoundingClientRect().width;
      svgHeight = document.getElementById('landing').getBoundingClientRect().height;
      setup(svg, svgWidth, svgHeight);
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
    resize: both;
  }

  svg {
    width: 100%; 
    height: 100%; 
  }
</style>
