<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import {createThumbPin, setSvgDimensions, createLine} from "./Util.js"; 
    import * as Constants from "./Constants.js"

    export let text;
    export let connectionBoolean; 

    let standaloneSvg, standaloneText; 
    let svgWidth, svgHeight; 
    let connectingLine = false; 

    onMount(async () => {
        
        if(connectionBoolean.top || connectionBoolean.bottom){
            const svg = d3.select(standaloneSvg);
            
            [svgWidth, svgHeight] = setSvgDimensions("standalone", svg);
            const top = svgHeight * 0.1; 
            const descriptionDiv = document.querySelector('.desc');
            const descriptionDivHeight = descriptionDiv.offsetHeight;
            
            // Create the bottom thumb pin
            const bottomPinYPosition = top + descriptionDivHeight;

            // Observer for standalone text
            const standaloneBottomPinPos = [svgWidth * 0.5, bottomPinYPosition];
            const standaloneTopPinPos = [svgWidth * 0.5, top]; 

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!connectingLine) {
                            connectingLine = true;
                            if(connectionBoolean.top){
                                createThumbPin(svg, standaloneTopPinPos);
                                connectionBoolean.lineTop.forEach((line) => {
                                createLine(svg, [svgWidth * line[0], svgHeight * line[1]], standaloneTopPinPos, 0);
                                });                
                            }
                            if(connectionBoolean.bottom){
                                setTimeout(() => {
                                    createThumbPin(svg, standaloneBottomPinPos); 
                                    connectionBoolean.lineBottom.forEach((line) => {
                                    createLine(svg, standaloneBottomPinPos, [svgWidth * line[0], svgHeight * line[1]], 0);
                                    });   
                                }, Constants.maxLineDelay*5);   
                            }
                        }
                    }
                });
            }, {
                threshold: 0.5 // Adjust this threshold as needed
            });
            
            observer.observe(standaloneText);
            }
    }); 
</script>

<section class="standalone-section webpage-section" id="standalone">
    <div class="desc">
        {#if !connectionBoolean.top}
            <img id="standalone-pin" src="/assets/pin.svg" alt="thumb pin" class="thumb-pin"/>
        {/if}
        {#if !connectionBoolean.bottom}
            <img id="standalone-bottom-pin" src="/assets/pin.svg" alt="thumb pin" class="thumb-pin"/>
        {/if}
        <div bind:this={standaloneText} id="standalone-text">
            {text[0]}
            <br>
            {#each text.slice(1) as t}
                <br>
                {t}
                <br>
            {/each}
        </div>
    </div>
    {#if connectionBoolean}
        <svg bind:this={standaloneSvg} id="standalone-svg"></svg>
    {/if}
</section>

<style>
    .standalone-section {
        height: 100vh;
        width: 100vw; 
        color: black;
        font-size: var(--body-font-size);
        /* display: flex; 
        justify-content: center;
        align-items: center; */
        position: relative;
        /* background-color: var(--white);  */
    }

    .desc {
        width: var(--text-box-width);
        height: 76vh; 
        background-color: var(--white);
        position: absolute; 
        top: 10%; 
        left: var(--text-box-x); 
        z-index: 0; 
    }

    #standalone-text {
        padding: var(--margin);
        height: fit-content; 
        font-size: var(--body-font-size); 
    }

    #standalone-svg {
        position: absolute; 
        display: block;
        z-index: 1;
    }

    #standalone-pin {
        top: -0.5rem;
        left: 50%; 
    }

    #standalone-bottom-pin {
        top: 99%;
        left: 50%; 
    }

</style>