<script>
  import { onMount } from "svelte";
  import * as d3 from 'd3';
  import { setSvgDimensions, createThumbPin, createLine} from "./Util.js";
  import * as Constants from "./Constants.js"

  let textBox, charactersSvg, characterSection;
  let svgWidth, svgHeight, svg; 
  let pinTop, pinRight, pinLeft, pinBottom; 
  let raymond, jake, amy, terry, rosa, gina, charles; 
  
  export let currentTextIndex; 
  
  let connectingLine = false; 
  let characterGifs; 
  let characters = [];

  onMount(() => {
    svg = d3.select(charactersSvg);
    [svgWidth, svgHeight] = setSvgDimensions("characters", svg);
    
    const textBoxBottom = Constants.characterTextBoxY + Constants.characterTextBoxHeight; 
    const textBoxLeft = 0.5 - Constants.characterTextBoxWidth/2; 
    const textBoxRight = 0.5 + Constants.characterTextBoxWidth/2; 

    pinTop = [svgWidth*0.5, svgHeight*Constants.characterTextBoxY]; 
    pinRight = [svgWidth*textBoxRight, svgHeight*0.2]; 
    pinLeft = [svgWidth*textBoxLeft, svgHeight*0.22];
    pinBottom = [svgWidth*0.5, svgHeight*textBoxBottom]; 
    characterGifs = {
    raymond: {
      name: "Captain Raymond Holt", 
      id:"raymond", 
      var: raymond, 
      pin: [0, 0], 
      originPin: pinRight
    },
    jake: {
      name: "Detective Jake Peralta", 
      id:"jake", 
      var: jake,
      pin: [0, 0],
      originPin: pinLeft
    },
    amy: {
      name: "Detective Amy Santiago",
      id:"amy",
      var: amy, 
      pin: [0, 0], 
      originPin: pinLeft
    },
    terry: {
      name: "Sergeant Terry Jeffords", 
      id:"terry", 
      var: terry, 
      pin: [0, 0],
      originPin: pinBottom
    }, 
    gina: {
      name: "Gina Linetti", 
      id:"gina", 
      var: gina, 
      pin: [0, 0], 
      originPin: pinBottom
    }, 
    charles: {
      name: "Detective Charles Boyle", 
      id:"charles", 
      var: charles, 
      pin: [0, 0],
      originPin: pinRight
    }, 
    rosa: {
      name: "Detective Rosa Diaz", 
      id:"rosa", 
      var: rosa, 
      pin: [0, 0], 
      originPin: pinBottom
    }
    }; 

    characterGifs.raymond.pin = [svgWidth * (textBoxRight+0.2), svgHeight*0.24]; 
    characterGifs.jake.pin = [svgWidth * (textBoxLeft-0.2), svgHeight*0.24]; 
    characterGifs.amy.pin = [svgWidth * (textBoxLeft-0.2), svgHeight*0.65]; 
    characterGifs.terry.pin = [svgWidth * (textBoxLeft), svgHeight*0.5]; 
    characterGifs.gina.pin = [svgWidth * 0.52, svgHeight*0.68];
    characterGifs.charles.pin = [svgWidth * (textBoxRight+0.2), svgHeight*0.65];
    characterGifs.rosa.pin = [svgWidth * (textBoxRight), svgHeight*0.48];
    characters = Object.values(characterGifs); 

    createThumbPin(svg, pinTop);     
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!connectingLine) {
            createLine(svg, [svgWidth*0.5, 0], pinTop, 0); 
            createThumbPin(svg, pinLeft); 
            createThumbPin(svg, pinRight); 
            createThumbPin(svg, pinBottom); 
            // let raymondElement = document.getElementById('raymond');
            connectingLine = true;
            // setTimeout(() => {
            //   addCharacterDiv(raymondElement, svg, characterGifs.raymond.pin, pinRight); 
            // }, Constants.maxLineDelay);
          }
        }
      });
    }, {
      threshold: 0.01 // Adjust this threshold as needed
    });

    observer.observe(textBox);
    
    return () => {
      observer.disconnect();
    };
  });

  function addCharacterDiv(element, svg, characterPin, originPin){
      setTimeout(() => { 
        if (element) {element.style.opacity = 1;}}, 
        Constants.maxLineDelay/3);
      // setTimeout(() => {createThumbPin(svg, characterPin)}, Constants.maxLineDelay);
      setTimeout(() => {
        createThumbPin(svg, characterPin)
        createLine(svg, originPin, characterPin, 0)}, 
        Constants.maxLineDelay/3);
  }

  $: {
    if (characters.length > 0 && typeof currentTextIndex === 'number' && currentTextIndex > 0 && currentTextIndex < characters.length+1) {
      let char = characters[currentTextIndex-1];
      let charElement = document.getElementById(char.id);

      // Ensure the element exists before manipulating it
      if (charElement) {
        charElement.style.visibility = 'visible';
        addCharacterDiv(charElement, svg, char.pin, char.originPin);
      } else {
        console.error(`Element with ID ${char.id} not found.`);
      }
    }
  }

</script>

<section bind:this={characterSection} class="characters-section" id="characters">
  <div bind:this={textBox} id="textBox">
    <div id="charText">{@html Constants.characterSectionText[currentTextIndex]}</div>
  </div>
  {#if characters}
    {#each characters as c}
      <div bind:this={c.var} id={c.id} class="character-containers">
        <img src="assets/{c.id}.gif" alt="{c.name} intro gif"/>
        <div>{c.name}</div>
      </div>
    {/each}
  {/if}
  <svg bind:this={charactersSvg}></svg>
</section>

<style>
  .characters-section {
    height: 100vh;
    position: relative;
  }

  .character-containers {
    display: flex; 
    flex-direction: column; 
    justify-content: center;
    align-items: center;
    gap: calc(var(--margin)/2); 
    background-color: var(--white); 
    font-size: var(--label-font-size); 
    width: fit-content;
    padding: calc(var(--margin)/2); 
    position: absolute; 
  }

  #textBox {
    width: var(--text-box-width);
    height: var(--text-box-height); 
    background-color: var(--white);
    position: absolute; 
    top: var(--text-box-y); 
    left: var(--text-box-x); 
    z-index: 0; 
  }

  #charText {
    padding: var(--margin);
    height: fit-content; 
    font-size: var(--body-font-size); 
  }

  .character-containers img{
    max-width: 15vw; 
  }

  #raymond {
    top: 24vh; 
    left: 80vw;
    opacity: 0; 
    transition: opacity var(--transition-time) ease-in-out; 
  }

  #charles {
    top: 65vh; 
    left: 80vw;
    opacity: 0; 
    transition: opacity var(--transition-time) ease-in-out; 
  }

  #jake {
    top: 24vh; 
    left: 4vw;
    opacity: 0; 
    transition: opacity var(--transition-time) ease-in-out;  
  }

  #amy {
    top: 65vh; 
    left: 4vw;
    opacity: 0; 
    transition: opacity var(--transition-time) ease-in-out; 
  }

  #terry {
    top: 50vh; 
    left: 24vw;
    opacity: 0; 
    transition: opacity var(--transition-time) ease-in-out; 
  }

  #gina {
    top: 68vh; 
    left: 42vw;
    opacity: 0; 
    transition: opacity var(--transition-time) ease-in-out; 
  }

  #rosa {
    top: 48vh; 
    left: 60vw;
    opacity: 0; 
    transition: opacity var(--transition-time) ease-in-out; 
  }

  .characters-section svg{
    position: relative; 
    z-index: 1; 
  }
</style>