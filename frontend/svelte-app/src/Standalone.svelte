<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import {createThumbPin, setSvgDimensions, createLine, resizeSVGs} from "./Util.js"; 
    import * as Constants from "./Constants.js"

    export let text;
    export let connectionBoolean; 
    export let sectionIndex; 

    let standaloneSvg, standaloneText; 
    let svgWidth, svgHeight; 
    let connectingLine = false; 
    let descriptionDiv; 
    let descriptionDivRect;

    onMount(() => {

        // resizeSVGs();

        // // Resize on window resize
        // const handleResize = () => {
        //     resizeSVGs();
        // };

        setTimeout(() => {
            if (connectionBoolean.top || connectionBoolean.bottom) {
                console.log(connectionBoolean.index); 

                const svg = d3.select(connectionBoolean.svg);
                const parentDiv = document.querySelector(`#standalone-${connectionBoolean.index}`);
                
                [svgWidth, svgHeight] = setSvgDimensions(parentDiv.id, svg); 
            
                descriptionDiv = document.getElementById(`standalone-description-${connectionBoolean.index}`); 
                
                if (descriptionDiv) {
                    descriptionDivRect = descriptionDiv.getBoundingClientRect();
                } else {
                    console.log(`Element with ID standalone-description-${connectionBoolean.index} not found.`);
                }

                // Create the bottom thumb pin
                const standaloneBottomPinPos = [svgWidth * 0.5, descriptionDivRect.y - sectionIndex*window.innerHeight + descriptionDivRect.height];
                const standaloneTopPinPos = [svgWidth * 0.5, descriptionDivRect.y - sectionIndex*window.innerHeight]; 

                // Observer for standalone text
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (!connectingLine) {
                                connectingLine = true;
                                if(connectionBoolean.top){
                                    connectionBoolean.lineTop.forEach((line) => {
                                    createLine(svg, [svgWidth * line[0], svgHeight * line[1]], standaloneTopPinPos, 0);
                                    });                
                                }
                                if(connectionBoolean.bottom){
                                    setTimeout(() => {
                                        connectionBoolean.lineBottom.forEach((line) => {
                                        createLine(svg, standaloneBottomPinPos, [svgWidth * line[0], svgHeight * line[1]], 0);
                                        });   
                                    }, Constants.maxLineDelay*3);   
                                }
                            }
                        }
                    });
                }, {
                    threshold: 0.5 // Adjust this threshold as needed
                });
                
                observer.observe(standaloneText);
            }
        }, 100); // Adjust the delay as needed

        // window.addEventListener('resize', handleResize);
    }); 

    // onDestroy(() => {
    //         window.removeEventListener('resize', handleResize);
    // });

</script>


<section class="standalone-section webpage-section" id={`standalone-${connectionBoolean.index}`}>
    <div class="desc divBorder" id={`standalone-description-${connectionBoolean.index}`}>
        <img id={`standalone-top-pin-${connectionBoolean.index}`} src="/assets/pins/pin.svg" alt="thumb pin" class="standalone-pin thumb-pin"/>
        <img id={`standalone-bottom-pin-${connectionBoolean.index}`} src="/assets/pins/pin.svg" alt="thumb pin" class="standalone-bottom-pin thumb-pin"/>
        <div bind:this={standaloneText} class="standalone-text" id={`standalone-text-${connectionBoolean.index}`}>
            {@html text[0]}
            <br>
            {#each text.slice(1) as t}
                <br>
                {@html t}
                <br>
            {/each}
        </div>
    </div>
    {#if connectionBoolean}
        <svg bind:this={connectionBoolean.svg} class="standalone-svg" id={`standalone-svg-${connectionBoolean.index}`}></svg>
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
        /* height: max-content;  */
        background-color: var(--white);
        position: absolute; 
        /* top: 10%;  */
        /* left: var(--text-box-x);  */
        top: 50%; 
        left: 50%; 
        transform: translateX(-50%) translateY(-50%); 
        z-index: 0; 
        display: block;
    }

    .standalone-text {
        padding: var(--margin);
        /* height: fit-content;  */
        font-size: var(--body-font-size); 
    }

    .standalone-svg {
        position: absolute; 
        display: block;
        z-index: -1;
    }

    .standalone-pin {
        top: -0.5rem;
        left: 50%; 
    }

    .standalone-bottom-pin {
        top: 99%;
        left: 50%; 
    }

</style>