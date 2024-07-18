<script>
  import { onMount } from "svelte";
  import * as d3 from 'd3';
  import { setSvgDimensions, createThumbPin, createLine, addOrUpdateLine, addOrUpdateThumbPin} from "./Util.js";
  import * as Constants from "./Constants.js"

  let textBox, charactersSvg, characterSection;
  let svgWidth, svgHeight, svg; 
  let pinTop, pinRight, pinLeft, pinBottom; 
  let raymond, jake, amy, terry, rosa, gina, charles; 
  let textBoxBottom, textBoxLeft, textBoxRight; 
  
  export let sectionIndex; 
  export let currentTextIndex; 
  
  let connectingLine = false; 
  let characterGifs; 
  let characters = [];
  let topLine = {line: null, startingPos: null, endingPos: null};

  function setCharacterPins(svgWidth, svgHeight, textBoxBottom, textBoxLeft, textBoxRight){
    characterGifs.raymond.pin.pos = [svgWidth * (textBoxRight+0.2), svgHeight*0.24]; 
    characterGifs.jake.pin.pos = [svgWidth * (textBoxLeft-0.2), svgHeight*0.24]; 
    characterGifs.amy.pin.pos = [svgWidth * (textBoxLeft-0.2), svgHeight*0.65]; 
    characterGifs.terry.pin.pos = [svgWidth * (textBoxLeft), svgHeight*0.5]; 
    characterGifs.gina.pin.pos = [svgWidth * 0.52, svgHeight*0.68];
    characterGifs.charles.pin.pos = [svgWidth * (textBoxRight+0.2), svgHeight*0.65];
    characterGifs.rosa.pin.pos = [svgWidth * (textBoxRight), svgHeight*0.48];
    return Object.values(characterGifs); 
  }

  function addCharacterDiv(element, svg, character){
      setTimeout(() => { 
        if (element) {element.style.opacity = 1;}
      }, Constants.maxLineDelay/3);
      setTimeout(() => {
        addOrUpdateThumbPin(svg, character.pin); 
        addOrUpdateLine(svg, character.characterLine, character.originPin.pos, character.pin.pos); 
      }, Constants.maxLineDelay/3);
  }

  onMount(() => {
    svg = d3.select(charactersSvg);
    
    svgWidth = document.getElementById("characters").getBoundingClientRect().width;
    svgHeight = document.getElementById("characters").getBoundingClientRect().height;
    
    textBoxBottom = Constants.characterTextBoxY + Constants.characterTextBoxHeight; 
    textBoxLeft = 0.5 - Constants.characterTextBoxWidth/2; 
    textBoxRight = 0.5 + Constants.characterTextBoxWidth/2; 

    pinTop = {ellipse: null, pos: [svgWidth*0.5, svgHeight*Constants.characterTextBoxY]}; 
    pinRight = {ellipse: null, pos: [svgWidth*textBoxRight, svgHeight*0.2]}; 
    pinLeft = {ellipse: null, pos: [svgWidth*textBoxLeft, svgHeight*0.22]};
    pinBottom = {ellipse: null, pos: [svgWidth*0.5, svgHeight*textBoxBottom]}; 
    
    characterGifs = {
      raymond: {
        name: "Captain Raymond Holt", 
        id:"raymond", 
        var: raymond, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinRight, 
        characterLine: {line: null, startingPos: null, endingPos: null}
      },
      jake: {
        name: "Detective Jake Peralta", 
        id:"jake", 
        var: jake,
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinLeft, 
        characterLine: {line: null, startingPos: null, endingPos: null}
      },
      amy: {
        name: "Detective Amy Santiago",
        id:"amy",
        var: amy, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinLeft,
        characterLine: {line: null, startingPos: null, endingPos: null}
      },
      terry: {
        name: "Sergeant Terry Jeffords", 
        id:"terry", 
        var: terry, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinBottom,
        characterLine: {line: null, startingPos: null, endingPos: null}
      }, 
      gina: {
        name: "Gina Linetti", 
        id:"gina", 
        var: gina, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinBottom,
        characterLine: {line: null, startingPos: null, endingPos: null}
      }, 
      charles: {
        name: "Detective Charles Boyle", 
        id:"charles", 
        var: charles, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinRight,
        characterLine: {line: null, startingPos: null, endingPos: null}
      }, 
      rosa: {
        name: "Detective Rosa Diaz", 
        id:"rosa", 
        var: rosa, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinBottom,
        characterLine: {line: null, startingPos: null, endingPos: null}
      }
    }; 

    characters = setCharacterPins(svgWidth, svgHeight, textBoxBottom, textBoxLeft, textBoxRight); 

    addOrUpdateThumbPin(svg, pinTop);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!connectingLine) {
            addOrUpdateLine(svg, topLine, [svgWidth*0.5, 0], pinTop.pos); 
            setTimeout(() => {
              addOrUpdateThumbPin(svg, pinLeft); 
              addOrUpdateThumbPin(svg, pinRight); 
              addOrUpdateThumbPin(svg, pinBottom); 
            }, Constants.maxLineDelay*2)
            connectingLine = true;
          }
        }
      });
    }, {
      threshold: 0.01
    });

    observer.observe(textBox);

    // making it responsive
    window.addEventListener('resize', () => {
      svgWidth = document.getElementById("characters").getBoundingClientRect().width;
      svgHeight = document.getElementById("characters").getBoundingClientRect().height;

      pinTop.pos = [svgWidth*0.5, svgHeight*Constants.characterTextBoxY]; 
      pinRight.pos = [svgWidth*textBoxRight, svgHeight*0.2]; 
      pinLeft.pos = [svgWidth*textBoxLeft, svgHeight*0.22];
      pinBottom.pos = [svgWidth*0.5, svgHeight*textBoxBottom]; 

      addOrUpdateThumbPin(svg, pinTop); 
      addOrUpdateThumbPin(svg, pinLeft); 
      addOrUpdateThumbPin(svg, pinRight); 
      addOrUpdateThumbPin(svg, pinBottom);

      if(connectingLine){
        addOrUpdateLine(svg, topLine, [svgWidth*0.5, 0], pinTop.pos); 
      }

      characters = setCharacterPins(svgWidth, svgHeight, textBoxBottom, textBoxLeft, textBoxRight);

      characters.forEach((character) => {
        let charElement = document.getElementById(character.id); 
        if(charElement.style.opacity == 1){
          console.log(character); 
          addOrUpdateThumbPin(svg, character.pin); 
          addOrUpdateLine(svg, character.characterLine, character.originPin.pos, character.pin.pos);  
        }
      })

    });
    
    return () => {
      observer.disconnect();
    };
  });

  $: {
    if (characters.length > 0 && typeof currentTextIndex === 'number' && currentTextIndex > 0 && currentTextIndex < characters.length+1) {
      let char = characters[currentTextIndex-1];
      let charElement = document.getElementById(char.id);

      // Ensure the element exists before manipulating it
      if (charElement) {
        charElement.style.visibility = 'visible';
        addCharacterDiv(charElement, svg, char);
      } else {
        console.error(`Element with ID ${char.id} not found.`);
      }
    }
  }

</script>

<section bind:this={characterSection} class="characters-section" id="characters">
  <div bind:this={textBox} id="textBox" class="divBorder">
    <div id="charText">{@html Constants.characterSectionText[currentTextIndex]}</div>
  </div>
  {#if characters}
    {#each characters as c}
      <div bind:this={c.var} id={c.id} class="character-containers divBorder">
        <img src="assets/gifs/{c.id}.gif" alt="{c.name} intro gif"/>
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
    /* height: fit-content; */
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
    width: 100%; 
    height: 100%; 
  }
</style>