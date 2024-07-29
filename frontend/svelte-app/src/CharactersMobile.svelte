<script>
    import { onMount } from "svelte";
    import * as d3 from 'd3';
    import { addOrUpdateLine, addOrUpdateThumbPin} from "./Util.js";
    import * as Constants from "./Constants.js"

    export let currentTextIndex; 
    let charactersMobileSvg; 
    let svgWidth, svgHeight, svg; 
    let textBoxMobile; 
    let charactersMobileSection; 
    let connectingLine = false; 
    let topLine = {line: null, startingPos: null, endingPos: null};
    let pinTop = {ellipse: null, pos:null}; 
    let characterGrid; 
    let characters = [
        { var: 'raymond', id: "raymond", text: Constants.characterSectionText[2] },
        { var: 'jake', id: "jake", text: Constants.characterSectionText[3] },
        { var: 'amy', id: "amy", text: Constants.characterSectionText[4] },
        { var: 'terry', id: "terry", text: Constants.characterSectionText[5] },
        { var: 'gina', id: "gina", text: Constants.characterSectionText[6] },
        { var: 'charles', id: "charles", text: Constants.characterSectionText[7]},
        { var: 'rosa', id: "rosa", text: Constants.characterSectionText[8] }
    ];
    

    onMount(() => {
        svg = d3.select(charactersMobileSvg);

        pinTop.pos = [textBoxMobile.offsetLeft + textBoxMobile.offsetWidth/2, textBoxMobile.offsetTop]; 
        // addOrUpdateThumbPin(svg, pinTop); 

        svgWidth = charactersMobileSection.getBoundingClientRect().width;
        svgHeight = charactersMobileSection.getBoundingClientRect().height;

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

        observer.observe(textBoxMobile);

        window.addEventListener('resize', () => { 
            if(charactersMobileSection){
                svgWidth = charactersMobileSection.getBoundingClientRect().width;
                svgHeight = charactersMobileSection.getBoundingClientRect().height;
                pinTop.pos = [textBoxMobile.offsetLeft + textBoxMobile.offsetWidth/2, textBoxMobile.offsetTop]; 
                if (connectingLine) {
                    addOrUpdateLine(svg, topLine, [svgWidth*0.5, 0], pinTop.pos); 
                    connectingLine = true;
                }
            }
        }); 

    }); 

    function handleMouseEnter(char) {
        char.var.style.cursor = "pointer";
        document.getElementById('charMobileText').innerHTML = char.text;
    }

    function handleMouseLeave(char) {
        char.var.style.cursor = "default";
        document.getElementById('charMobileText').innerHTML = Constants.characterSectionText[currentTextIndex];
    }

    $: if(currentTextIndex == 1){
        if(characterGrid){
            characterGrid.style.opacity = 1; 
        }
    }
</script>

<section bind:this={charactersMobileSection} id="characters-mobile">
    <div class="characters-content">
        <div bind:this={textBoxMobile} class="textBoxMobile divBorder">
            <img src="/assets/pins/pin.svg" alt="thumb pin" class="pin"/>
            <div id="charMobileText">{@html Constants.characterSectionText[currentTextIndex]}</div>
        </div>
        <div bind:this={characterGrid} class="character-grid">
            <!-- {#if characters} -->
                {#each characters as character}
                    <div bind:this={character.var} class="image-div divBorder"  
                        on:mouseenter={() => handleMouseEnter(character)}
                        on:mouseleave={() => handleMouseLeave(character)}>
                            <img src="/assets/pins/pin.svg" alt="thumb pin" class="pin"/>
                            <img src={`assets/gifs/${character.id}.gif`} alt="{character.id} introductory gif" class="gif"/>
                    </div>
                {/each}
            <!-- {/if} -->
        </div>
    </div>
    
    <svg bind:this={charactersMobileSvg}></svg>
</section>


<style>
    .character-pin{
        left: 50%; 
        top: -0.5rem;
    }

    #characters-mobile{
        width: 100vw; 
        height: 100vh;  
    }

    .pin {
        position: absolute;
        top: -0.5rem;
        left: 50%;
        transform: translateX(-50%);
        width: var(--label-font-size); 
        height: var(--label-font-size);
        z-index: 1; /* Ensure pin is above the div */
    }

    .characters-content{
        position: absolute; 
        z-index: 2; 
        display: flex; 
        flex-direction: column; 
        align-items: center;
        justify-content: flex-start;
        width: 100%; 
        height: 100vh; 
        gap: var(--margin); 
    }

    .textBoxMobile {
        width: 80vw; 
        height: 30vh; 
        background-color: var(--white);
        padding: var(--margin);
        margin-top: calc(var(--margin)*2); 
        position: relative; 
    }

    .character-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: var(--margin); /* Adjust the gap between images as needed */
        justify-items: center;
        align-items: center;
        width: 80%; 
        opacity: 0; 
        transition: opacity var(--transition-time); 
    }

    #characters-mobile svg{
        position: relative; 
        z-index: 1; 
        width: 100%; 
        height: 100%; 
    }

    .image-div {
        position: relative; 
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: calc(var(--margin) / 2);
        background-color: var(--white);
        font-size: var(--label-font-size);
        width: fit-content;
        padding: calc(var(--margin) / 2);
        width: fit-content; 
        height: fit-content; 
    }


    .gif {
        width: 30vw;
        height: auto;
        display: block;
    }

    .character-grid > .image-div:nth-last-child(1):nth-child(odd) {
        grid-column: span 2;
        justify-self: center;
    }

</style>