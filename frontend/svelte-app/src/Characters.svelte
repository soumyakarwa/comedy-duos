<script>
  import { onMount } from "svelte";
  import * as d3 from 'd3';
  import { addOrUpdateLine, addOrUpdateThumbPin} from "./Util.js";
  import * as Constants from "./Constants.js"

  let textBox, charactersSvg, characterSection;
  let svgWidth, svgHeight, svg; 
  let pinTop = {ellipse: null, pos: [svgWidth*0.5, svgHeight*Constants.characterTextBoxY]}; 
  let pinRight = {ellipse: null, pos: [svgWidth*0.5, svgHeight*Constants.characterTextBoxY]}; 
  let pinLeft = {ellipse: null, pos: [svgWidth*0.5, svgHeight*Constants.characterTextBoxY]}; 
  let pinBottom = {ellipse: null, pos: [svgWidth*0.5, svgHeight*Constants.characterTextBoxY]}; 
  let raymond, jake, amy, terry, rosa, gina, charles; 
  let textBoxBottom, textBoxLeft, textBoxRight; 
  
  export let currentTextIndex; 
  
  let connectingLine = false; 
  let characterGifs; 
  let characters = [];
  let topLine = {line: null, startingPos: null, endingPos: null};

  // svg thumb pins not in the dom
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
        const charRect = character.var.getBoundingClientRect();
        addOrUpdateLine(svg, character.characterLine, character.originPin.pos, [charRect.x + charRect.width/2, charRect.y]); 
      }, Constants.maxLineDelay/3);
  }

  onMount(() => {
    svg = d3.select(charactersSvg);
    
    svgWidth = document.getElementById("characters").getBoundingClientRect().width;
    svgHeight = document.getElementById("characters").getBoundingClientRect().height;
    
    textBoxBottom = Constants.characterTextBoxY + Constants.characterTextBoxHeight; 
    textBoxLeft = 0.5 - Constants.characterTextBoxWidth/2; 
    textBoxRight = 0.5 + Constants.characterTextBoxWidth/2; 

    pinTop.pos = [svgWidth*0.5, svgHeight*Constants.characterTextBoxY]; 
    pinRight.pos = [svgWidth*textBoxRight, svgHeight*0.2]; 
    pinLeft.pos = [svgWidth*textBoxLeft, svgHeight*0.22];
    pinBottom.pos = [svgWidth*0.5, svgHeight*textBoxBottom]; 

    
    characterGifs = {
      charles: {
        name: "Detective Charles Boyle", 
        id:"charles", 
        var: charles, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinRight,
        characterLine: {line: null, startingPos: null, endingPos: null},
        text: Constants.characterSectionText[7]
      }, 
      raymond: {
        name: "Captain Raymond Holt", 
        id:"raymond", 
        var: raymond, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinRight, 
        characterLine: {line: null, startingPos: null, endingPos: null},
        text: Constants.characterSectionText[2]
      },
      amy: {
        name: "Detective Amy Santiago",
        id:"amy",
        var: amy, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinLeft,
        characterLine: {line: null, startingPos: null, endingPos: null},
        text: Constants.characterSectionText[4]
      },
      jake: {
        name: "Detective Jake Peralta", 
        id:"jake", 
        var: jake,
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinLeft, 
        characterLine: {line: null, startingPos: null, endingPos: null},
        text: Constants.characterSectionText[3]
      },
      terry: {
        name: "Sergeant Terry Jeffords", 
        id:"terry", 
        var: terry, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinBottom,
        characterLine: {line: null, startingPos: null, endingPos: null},
        text: Constants.characterSectionText[5]
      }, 
      gina: {
        name: "Gina Linetti", 
        id:"gina", 
        var: gina, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinBottom,
        characterLine: {line: null, startingPos: null, endingPos: null},
        text: Constants.characterSectionText[6], 
      }, 
      rosa: {
        name: "Detective Rosa Diaz", 
        id:"rosa", 
        var: rosa, 
        pin: {ellipse: null, pos: [0, 0]}, 
        originPin: pinBottom,
        characterLine: {line: null, startingPos: null, endingPos: null},
        text: Constants.characterSectionText[8]
      }
    }; 

    characters = setCharacterPins(svgWidth, svgHeight, textBoxBottom, textBoxLeft, textBoxRight); 

    addOrUpdateThumbPin(svg, pinTop);
    addOrUpdateThumbPin(svg, pinLeft); 
    addOrUpdateThumbPin(svg, pinRight); 
    addOrUpdateThumbPin(svg, pinBottom); 
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!connectingLine) {
            addOrUpdateLine(svg, topLine, [svgWidth*0.5, 0], pinTop.pos); 
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
        if(character.var.style.opacity == 1){
          const charRect = character.var.getBoundingClientRect();
          addOrUpdateLine(svg, character.characterLine, character.originPin.pos, [charRect.x + charRect.width/2, charRect.y]); 
        }
      })

    });
    
  });

  $: {
    if (characters.length > 0 && currentTextIndex == 1){
      characters.forEach((char, index) => {
        if (char.var) {
          char.var.style.visibility = 'visible';
          
          setTimeout(() => {
            addCharacterDiv(char.var, svg, char);
          }, index * Constants.transitionTime/2); 
          
          
          char.var.addEventListener('mouseenter', () => {
            char.var.style.cursor = "pointer"; 
            document.getElementById('charText').innerHTML = char.text;
          });

          // Add mouse leave event listener to revert text
          char.var.addEventListener('mouseleave', () => {
            char.var.style.cursor = "default"; 
            document.getElementById('charText').innerHTML = Constants.characterSectionText[currentTextIndex];
          });

        } else {
          console.error(`Element with ID ${char.id} not found.`);
        }
      })
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
        <img src="/assets/pins/pin.svg" alt="thumb pin" class="character-pin"/>
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

  .character-containers {
    z-index: 2; 
  }

  .character-containers img{
    max-width: 15vw; 
  }

  .character-pin {
    position: absolute;
    width: var(--label-font-size);
    height: var(--label-font-size);
    /* transform: translateX(-50%); */
    top: -0.5rem;
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