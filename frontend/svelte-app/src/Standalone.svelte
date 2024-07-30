<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import {createThumbPin, setSvgDimensions, createLine, resizeSVGs, addOrUpdateLine, removeLine} from "./Util.js"; 
    import * as Constants from "./Constants.js"

    export let text;
    export let connectionBoolean; 

    let standaloneSvg, standaloneText; 
    let svgWidth, svgHeight; 
    let connectingLine = false; 
    let descriptionDiv; 
    let descriptionDivRect;
    let svg; 

    let topLines = {tablet: [], desktop: []};
    let bottomLines = {tablet: [], desktop: []};

    let bottomPin = null; 
    let topPin = null; 

    function setThumbPinPositions(svgWidth, descriptionDiv) {
        let scaleValues = []; 

        if(window.innerWidth > Constants.mobileSize){
            scaleValues = [0.5, 0.5]; 
        }
        else {
            scaleValues = [0.55, 0.45]; 
        }

        topPin = [svgWidth * 0.5, descriptionDiv.offsetTop - descriptionDiv.getBoundingClientRect().height * scaleValues[0]];
        bottomPin = [svgWidth * 0.5, descriptionDiv.offsetTop + descriptionDiv.getBoundingClientRect().height * scaleValues[1]];
    }


    onMount(() => {
        connectionBoolean.lineTop?.tablet.forEach((l) => {
            topLines.tablet.push({line: null, startingPos: null, endingPos: null}); 
        });

        connectionBoolean.lineBottom?.tablet.forEach((l) => {
            bottomLines.tablet.push({line: null, startingPos: null, endingPos: null});
        });

        connectionBoolean.lineTop?.desktop.forEach((l) => {
            topLines.desktop.push({line: null, startingPos: null, endingPos: null}); 
        });

        connectionBoolean.lineBottom?.desktop.forEach((l) => {
            bottomLines.desktop.push({line: null, startingPos: null, endingPos: null});
        });

        descriptionDiv = document.getElementById(`standalone-description-${connectionBoolean.index}`); 
        let parentDiv = descriptionDiv.parentElement;

        let elementOffsetTop = descriptionDiv.offsetTop;
        let elementOffsetLeft = descriptionDiv.offsetLeft;   

        setTimeout(() => {
            if (connectionBoolean.top || connectionBoolean.bottom) {

                svg = d3.select(connectionBoolean.svg);
                
                svgWidth = document.getElementById(`standalone-${connectionBoolean.index}`).getBoundingClientRect().width; 
                svgHeight = document.getElementById(`standalone-${connectionBoolean.index}`).getBoundingClientRect().height;   
            
                
                if (descriptionDiv) {
                    descriptionDivRect = descriptionDiv.getBoundingClientRect();
                } else {
                    console.log(`Element with ID standalone-description-${connectionBoolean.index} not found.`);
                }

                setThumbPinPositions(svgWidth, descriptionDiv); 

                // Observer for standalone text
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            if (!connectingLine) {
                                connectingLine = true;
                                console.log(window.innerWidth); 
                                if (window.innerWidth < Constants.tabletSize || window.innerWidth === Constants.tabletSize) {
                                    if (connectionBoolean.top) {
                                    connectionBoolean.lineTop.tablet.forEach((l, i) => {
                                        addOrUpdateLine(svg, topLines.tablet[i], [svgWidth * l[0], svgHeight * l[1]], topPin)
                                    });        
                                    }       
                                    if (connectionBoolean.bottom) { 
                                        setTimeout(() => {
                                            connectionBoolean.lineBottom.tablet.forEach((l, i) => {
                                                addOrUpdateLine(svg, bottomLines.tablet[i], bottomPin, [svgWidth * l[0], svgHeight * l[1]]);                               
                                            });   
                                        }, Constants.maxLineDelay*3);  
                                    } 
                                }
                                else {
                                    if (connectionBoolean.top) {
                                    connectionBoolean.lineTop.desktop.forEach((l, i) => {
                                        addOrUpdateLine(svg, topLines.desktop[i], [svgWidth * l[0], svgHeight * l[1]], topPin)
                                    });        
                                    }       
                                    if (connectionBoolean.bottom) { 
                                        setTimeout(() => {
                                            connectionBoolean.lineBottom.desktop.forEach((l, i) => {
                                                addOrUpdateLine(svg, bottomLines.desktop[i], bottomPin, [svgWidth * l[0], svgHeight * l[1]]);                               
                                            });   
                                        }, Constants.maxLineDelay*3);  
                                    } 
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

        window.addEventListener('resize', () => {
            svgWidth = document.getElementById(`standalone-${connectionBoolean.index}`).getBoundingClientRect().width;
            svgHeight = document.getElementById(`standalone-${connectionBoolean.index}`).getBoundingClientRect().height;

            // Ensure the descriptionDiv bounding box is updated
            descriptionDiv = document.getElementById(`standalone-description-${connectionBoolean.index}`); 

            // Update thumb pin positions
            setThumbPinPositions(svgWidth, descriptionDiv);

            // If lines are already drawn, redraw the lines
            if (connectingLine) {
                if (window.innerWidth < Constants.tabletSize || window.innerWidth === Constants.tabletSize) {
                    if (connectionBoolean.top) {
                        connectionBoolean.lineTop.tablet.forEach((l, i) => {
                            addOrUpdateLine(svg, topLines.tablet[i], [svgWidth * l[0], svgHeight * l[1]], topPin)
                        });     
                        
                        connectionBoolean.lineTop.desktop.forEach((l, i) => {
                            if (topLines.desktop[i].line) {
                                removeLine(topLines.desktop[i]); 
                            }
                        });
                    }       
                    if (connectionBoolean.bottom) { 
                        connectionBoolean.lineBottom.tablet.forEach((l, i) => {
                            addOrUpdateLine(svg, bottomLines.tablet[i], bottomPin, [svgWidth * l[0], svgHeight * l[1]]);                               
                        });  
                        
                        connectionBoolean.lineBottom.desktop.forEach((l, i) => {
                            if (bottomLines.desktop[i].line) {
                                removeLine(bottomLines.desktop[i]); 
                            }
                        });
                    } 
                }
                else {
                    if (connectionBoolean.top) {
                        connectionBoolean.lineTop.desktop.forEach((l, i) => {
                            addOrUpdateLine(svg, topLines.desktop[i], [svgWidth * l[0], svgHeight * l[1]], topPin)
                        });  
                        

                        connectionBoolean.lineTop.tablet.forEach((l, i) => {
                            if (topLines.tablet[i].line) {
                                removeLine(topLines.tablet[i]); 
                            }
                        });
                    }       
                    if (connectionBoolean.bottom) { 
                        connectionBoolean.lineBottom.desktop.forEach((l, i) => {
                            addOrUpdateLine(svg, bottomLines.desktop[i], bottomPin, [svgWidth * l[0], svgHeight * l[1]]);                               
                        });     

                        connectionBoolean.lineBottom.tablet.forEach((l, i) => {
                            if (bottomLines.tablet[i].line) {
                                removeLine(bottomLines.tablet[i]); 
                            }
                        }); 
                    } 
                }
            }
        });

    }); 
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
        /* position: relative;  */
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
        z-index: 1;
    }

    .standalone-pin {
        top: -0.5rem;
        left: 50%; 
    }

    .standalone-bottom-pin {
        top: 99%;
        left: 50%; 
    }

    svg {
        width: 100%; 
        height: 100%; 
    }

    @media (max-width: 480px){
        .desc {
            transform: translateX(-50%) translateY(-55%); 
        }
    }

</style>