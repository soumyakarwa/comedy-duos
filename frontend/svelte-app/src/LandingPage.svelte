<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import * as Constants from "./Constants.js";
  import {addOrUpdateLine, addOrUpdateThumbPin} from "./Util.js"
  
  let landingPageSvg;
  let svgWidth, svgHeight; 
  let initialSetup = true;
  export let sectionIndex;

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
    topPins: {ellipse: null, pos: null}, 
    bottomPins: {ellipse: null, pos: null}
  };

  let arrowImgData = {
    img: null,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    topPins: {ellipse: null, pos: null}, 
    bottomPins: {ellipse: null, pos: null}
  };

  let titleImgData = {
    img: null,
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    topPins: [{ellipse: null, pos: null}, {ellipse: null, pos: null}],
    bottomPins: [{ellipse: null, pos: null}, {ellipse: null, pos: null}]
  };

  let lines = {
    topLeft: {line: null, startingPos: null, endingPos: null},
    topRight: {line: null, startingPos: null, endingPos: null},
    bottomLeft: {line: null, startingPos: null, endingPos: null},
    bottomRight: {line: null, startingPos: null, endingPos: null},
  }

  function setPosition(svg, svgWidth, svgHeight){
    caseImageData.height = svgHeight * 0.07;
    caseImageData.x = svgWidth * 0.02;
    caseImageData.y =  svgHeight * 0.045;
    caseImageData.topPins.pos = [caseImageData.x*6, caseImageData.y]; 
    caseImageData.bottomPins.pos = [caseImageData.x*7.5, caseImageData.y  + caseImageData.height]; 

    detectiveImgData.height = svgHeight * 0.09;
    detectiveImgData.x = svgWidth*0.88; 
    detectiveImgData.y = svgHeight * 0.88; 
    detectiveImgData.topPins.pos = [detectiveImgData.x + svgWidth*0.047, detectiveImgData.y];

    titleImgData.height = svgHeight * 0.46;
    titleImgData.width = 1011/435 * titleImgData.height; 
    titleImgData.x = svgWidth*0.215; 
    titleImgData.y = svgHeight * 0.285; 
    titleImgData.topPins[0].pos = [titleImgData.x + 0.3*titleImgData.width, titleImgData.y]; 
    titleImgData.topPins[1].pos = [titleImgData.x+ titleImgData.width - 4, titleImgData.y];
    titleImgData.bottomPins[0].pos = [titleImgData.x + 0.2*titleImgData.width, titleImgData.y + titleImgData.height]; 
    titleImgData.bottomPins[1].pos = [titleImgData.x + titleImgData.width - 6, titleImgData.y + titleImgData.height]; 

    arrowImgData.height = titleImgData.height * 0.2; 
    arrowImgData.width = arrowImgData.height*169/88.41; 
    arrowImgData.x = titleImgData.x + titleImgData.width + 10; 
    arrowImgData.y = titleImgData.y + titleImgData.height - arrowImgData.height; 
    arrowImgData.topPins.pos = [arrowImgData.x + arrowImgData.width/2, arrowImgData.y];

  }

  function addImages(svg){
    if(!caseImageData.img){
      caseImageData.img = svg.append("image")
        .attr("xlink:href", "/assets/landing-page/caseTextWithBorder.svg") 
    }

    if(!titleImgData.img){
      titleImgData.img = svg.append("image")
       .attr("xlink:href", "/assets/landing-page/titleWithBorder.svg") ; 
    }

    if(!detectiveImgData.img){
      detectiveImgData.img = svg.append("image")
      .attr("xlink:href", "/assets/landing-page/detectiveWithBorder.svg") 
    }

    if(!arrowImgData.img){
        arrowImgData.img = svg.append("image")
        .attr("xlink:href", "/assets/landing-page/arrowsWithBorder.svg")
        .attr("opacity", 0); 
      }

  }

  function setup(svg, svgWidth, svgHeight) {
    setPosition(svg, svgWidth, svgHeight);
    addImages(svg); 
    
    caseImageData.img.attr("x", caseImageData.x) 
        .attr("y", caseImageData.y)
        .attr("height", caseImageData.height);

    titleImgData.img
       .attr("x", titleImgData.x) 
       .attr("y",titleImgData.y)
      //  .attr("width", titleImgWidth);   
       .attr("height", titleImgData.height);

    detectiveImgData.img
    .attr("x", detectiveImgData.x) 
    .attr("y", detectiveImgData.y)
    .attr("height", detectiveImgData.height); 

    // IMMEDIATE UPDATE FOR THUMB PINS AND LINES IF THE PAGE IS BEING RESIZED
    if (initialSetup) {
    setTimeout(() => {
      arrowImgData.img
        .attr("x", arrowImgData.x)
        .attr("y", arrowImgData.y)
        .attr("height", arrowImgData.height)
        .attr("opacity", 0)
        .transition()
        .duration(Constants.transitionTime)
        .attr("opacity", 1);
        addOrUpdateThumbPin(svg, arrowImgData.topPins);
    }, Constants.maxLineDelay * 5);

    addOrUpdateThumbPin(svg, caseImageData.topPins);

    setTimeout(() => {
      addOrUpdateThumbPin(svg, caseImageData.bottomPins);
      addOrUpdateThumbPin(svg, titleImgData.topPins[0]);
      setTimeout(() => {
        addOrUpdateLine(svg, lines.topLeft, caseImageData.bottomPins.pos, titleImgData.topPins[0].pos);
      }, Constants.maxLineDelay / 2);
    }, Constants.maxLineDelay);

    setTimeout(() => {
      addOrUpdateThumbPin(svg, titleImgData.topPins[1]);
      setTimeout(() => {
        addOrUpdateLine(svg, lines.topRight, titleImgData.topPins[1].pos, [svgWidth, 0])
      }, Constants.maxLineDelay / 2);
    }, Constants.maxLineDelay * 2);

    setTimeout(() => {
      addOrUpdateThumbPin(svg, titleImgData.bottomPins[0]);
      setTimeout(() => {
        addOrUpdateLine(svg, lines.bottomLeft,  titleImgData.bottomPins[0].pos, [svgWidth * 0.455, svgHeight]);
      }, Constants.maxLineDelay / 2);
    }, Constants.maxLineDelay * 4);

    setTimeout(() => {
      addOrUpdateThumbPin(svg, titleImgData.bottomPins[1]);
      addOrUpdateThumbPin(svg, detectiveImgData.topPins);
      setTimeout(() => {
        addOrUpdateLine(svg, lines.bottomRight, titleImgData.bottomPins[1].pos, detectiveImgData.topPins.pos);
      }, Constants.maxLineDelay / 2);
    }, Constants.maxLineDelay * 3);

      initialSetup = false; 
    } else {
      arrowImgData.img
        .attr("x", arrowImgData.x)
        .attr("y", arrowImgData.y)
        .attr("height", arrowImgData.height); 
      addOrUpdateThumbPin(svg, arrowImgData.topPins);
      addOrUpdateThumbPin(svg, caseImageData.topPins);
      addOrUpdateThumbPin(svg, caseImageData.bottomPins);
      addOrUpdateThumbPin(svg, titleImgData.topPins[0]);
      addOrUpdateThumbPin(svg, titleImgData.topPins[1]);
      addOrUpdateThumbPin(svg, titleImgData.bottomPins[0]);
      addOrUpdateThumbPin(svg, titleImgData.bottomPins[1]);
      addOrUpdateThumbPin(svg, detectiveImgData.topPins);

      addOrUpdateLine(svg, lines.topLeft, caseImageData.bottomPins.pos, titleImgData.topPins[0].pos);
      addOrUpdateLine(svg, lines.topRight, titleImgData.topPins[1].pos, [svgWidth, 0]); 
      addOrUpdateLine(svg, lines.bottomLeft,  titleImgData.bottomPins[0].pos, [svgWidth * 0.455, svgHeight]);
      addOrUpdateLine(svg, lines.bottomRight, titleImgData.bottomPins[1].pos, detectiveImgData.topPins.pos);
    }
  }

  
  onMount(async () => {
    const svg = d3.select(landingPageSvg);
    
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
