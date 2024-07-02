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
        
        if(connectionBoolean){
            const svg = d3.select(standaloneSvg);
            
            [svgWidth, svgHeight] = setSvgDimensions("standalone", svg);
            const top = svgHeight * 0.1; 
            const descriptionDiv = document.querySelector('.desc');
            const descriptionDivHeight = descriptionDiv.offsetHeight;
            
            // Create the top thumb pin
            createThumbPin(svg, [svgWidth * 0.5, top]);

            // Create the bottom thumb pin
            const bottomPinYPosition = top + descriptionDivHeight;

            // Observer for standalone text
            const standaloneBottomPinPos = [svgWidth * 0.5, bottomPinYPosition];

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (!connectingLine) {
                            connectingLine = true;
                            createThumbPin(svg, standaloneBottomPinPos); 
                            createLine(svg, standaloneBottomPinPos, [svgWidth * 0.375, svgHeight], Constants.maxLineDelay/3);
                            createLine(svg, standaloneBottomPinPos, [svgWidth * 0.625, svgHeight], Constants.maxLineDelay/3);
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
        {#if !connectionBoolean}
            <img id="standalone-pin" src="/assets/pin.svg" alt="thumb pin" class="thumb-pin"/>
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
        height: 74vh; 
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