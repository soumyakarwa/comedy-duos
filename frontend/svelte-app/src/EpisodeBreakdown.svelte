<script>
    import Scroll from "./Scrolly.svelte";
    import { fade, slide } from 'svelte/transition';
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as Constants from "./Constants.js"; 
    
    // SVG ELEMENTS
    let episodeSvg; 
    let baseRect; 
    let heatMap; 
    let episodeRectText = [{rect: null, text: null},{rect: null, text: null}, {rect: null, text: null}]
    const showDescriptions = writable(false);
    let specificEpisodeGroup; 
    let xScale; 
    let yScale; 
    let rectWidth;
    let rectYPosIncrement;

    export let episodeData;
    export let specificDataPoint;
    
    let rectYPos = 0; 
    let episodeDescriptions = []; 
    let newDescription3;
    let characterHighlights = []; 
    let currentStep;
    let previousStep = -1; 
    
    const steps = [`Let's consider this square to represent an episode.`, `Using three different descriptions provided me more insight, and allowed me to compare and contrast the plots for each episode.`, `Breaking the descriptions down to sentences provides insight about the different plot points.`, `Breaking down complicated sentences into clauses to improve analysis.`, `Analysing each part for character groups or pairings.`, `Comparing the descriptions to identify distinct groups. For instance, all three descriptions contain a distinct group of Jake, Charles and Terry.`, `Now it gets interesting. Description 1 is just one long sentence, but Description 3 is comprehensible and divided. I used Description 3 to correspond and break-up larger groups in Descriptions 1 & 2. So we know the second pair is, Captain Holt & Rosa.`, `And lastly, we have the unlikely duo of Amy & Gina! And so we know the groupings in __ episode. The next step, is to carry this out for all episodes of all seasons!`]
    
    $: if (specificDataPoint){
        episodeDescriptions[0] = setSentenceHighlight(specificDataPoint[`Episode Description`], specificDataPoint[`Episode Description Analysis`]); 
        episodeDescriptions[1] = setSentenceHighlight(specificDataPoint[`Wiki Fandom Descriptions`], specificDataPoint[`Wiki Fandom Description Analysis`]); 
        episodeDescriptions[2] = setSentenceHighlight(specificDataPoint[`Wikipedia Episode Descriptions`], specificDataPoint[`Wikipedia Description Analysis`]);

        const svgSelection = d3.select(episodeSvg);
        const baseRectSelection = d3.select(baseRect);

        specificEpisodeGroup = svgSelection.append('g'); 
        specificEpisodeGroup.node().appendChild(baseRectSelection.node());

        const seasons = Array.from(new Set(episodeData.map(d => d.Season)));
        const episodes = Array.from(new Set(episodeData.map(d => d.Episode)));

        xScale = d3.scaleBand()
            .domain(seasons)
            .range([0, 0.45*window.innerWidth])
            .padding(0.1);

        yScale = d3.scaleBand()
            .domain(episodes)
            .range([0, 0.6*window.innerHeight])
            .padding(0.1);

        rectWidth = 0.3*window.innerWidth; 
        rectYPosIncrement = rectWidth/3; 
    };

        /**
     * Setting initial sentence highlight spans in current step = 2
     * @param description
     * @param analysis
     */
     function setSentenceHighlight(description, analysis) {
        description = description.replace(/\n\s*\"/g, '').replace(/\"\s*\n/g, '').replace(/\\n/g, ' ').replace(/\"/g, '');
        let highlighted = description; 

        let parsedAnalysis;
        if (typeof analysis === 'string') {
            parsedAnalysis = JSON.parse(analysis);
        } else {
            parsedAnalysis = analysis;
        }

        parsedAnalysis.forEach((item, index) => {
            let sentence = item.sentence;
            let span = `<span class="highlight" style="--highlight-color: ${Constants.colors[index % Constants.colors.length]};">${sentence}</span>`;
            highlighted = highlighted.replace(sentence, span);
        });

        return highlighted;
    }

    /**
     * Setting character highlights spans in current step = 4
     * @param description
     * @param analysis
     */
    function setCharacterHighlight(description, analysis) {
        let highlighted = description; 
        let parsedAnalysis;
        if (typeof analysis === 'string') {
            parsedAnalysis = JSON.parse(analysis);
        } else {
            parsedAnalysis = analysis;
        }

        parsedAnalysis.forEach((item, index) => {
            let characters = item.characters;
            let sentence = item.sentence; 
            let trackSentence = sentence;
            characters.forEach((c) => {
                let span = `<span class="highlight" style="--highlight-color: ${Constants.colors[index % Constants.colors.length]};">${c}</span>`;
                sentence = sentence.replace(c, span);
            })          
            highlighted = highlighted.replace(trackSentence, sentence); 
        });
        return highlighted;
    }

    /**
     * Adds highlight animation to elements (removes unhighlight animation)
     * @param elements
     */
    function highlightSentences(elements) {
        elements.forEach(element => {
            element.style.animation = 'none';
            requestAnimationFrame(() => {
                element.style.animation = '';
                element.classList.remove('unhighlight');
                element.classList.add('highlight');
                element.style.animation = 'highlight-animation var(--transition-time) linear forwards';
            });
        });
    }    

    /**
     * Adds unhighlight animation to elements (removes highlight animation)
     * @param elements
     */
    function unhighlightSentences(elements) {
        elements.forEach(element => {
            element.style.animation = 'none';
            requestAnimationFrame(() => {
                element.style.animation = '';
                element.classList.remove('highlight');
                element.classList.add('unhighlight');
                element.style.animation = 'unhighlight-animation var(--transition-time) linear forwards';
            });
        });
    }   

    /**
     * Calling highlightSentenceS() for elements in Description 1
     */
    function highlightDescription1(){
        const description1HighlightElements = document.querySelectorAll('#officialDescription .highlight,  #officialDescription .unhighlight');
        highlightSentences(description1HighlightElements); 
    }  

    /**
     * Calling highlightSentenceS() for elements in Description 2
     */
    function highlightDescription2(){
        const description2HighlightElements = document.querySelectorAll('#wikifandomDescription .highlight, #wikifandomDescription .unhighlight');
        highlightSentences(description2HighlightElements); 
    }

    /**
     * Calling highlightSentenceS() for elements in Description 3
     */
    function highlightDescription3(){
        const description3HighlightElements = document.querySelectorAll('#wikipediaDescription .highlight, #wikipediaDescription .unhighlight');
        highlightSentences(description3HighlightElements); 
    }

    /**
     * Calling unhighlightSentences() for elements in Description 1
     */
    function unhighlightDescription1(){
        const description1HighlightElements = document.querySelectorAll('#officialDescription .highlight');
        unhighlightSentences(description1HighlightElements); 
    }

    /**
     * Calling unhighlightSentences() for elements in Description 2
     */
    function unhighlightDescription2(){
        const description2HighlightElements = document.querySelectorAll('#wikifandomDescription .highlight');
        unhighlightSentences(description2HighlightElements); 
    }

    /**
     * Calling unhighlightSentences() for elements in Description 3
     */
    function unhighlightDescription3(){
        const description3HighlightElements = document.querySelectorAll('#wikipediaDescription .highlight');
        unhighlightSentences(description3HighlightElements); 
    }

    /**
     * Adds character pairing rect at specific xPos, yPos. Writes the characterNames to 
     * the center of the rect
     * @param xPos
     * @param yPos
     * @param characterNames
     * @param color
     * @param width
     */
    function drawRect(xPos, yPos, characterNames, color){
        const rowHeight = rectWidth/3; 
        const characterNamesText = characterNames.join(', ');

        const rect = specificEpisodeGroup
        .append('rect')
        .attr('x', xPos)
        .attr('y', yPos)
        .attr('width', 0) 
        .attr('height', rowHeight)
        .attr('fill', color); 
        
        rect
        .transition() 
        .duration(Constants.transitionTime) 
        .ease(d3.easeCubicIn)
        .attr('width', rectWidth);

        // Append the text
        const text = specificEpisodeGroup
            .append('text')
            .attr('x', xPos + rectWidth / 2) 
            .attr('y', yPos + rowHeight / 2) 
            .attr('dy', '.35em') 
            .attr('text-anchor', 'middle')
            .text(characterNamesText)
            .style('fill', 'black')
            .style('opacity', 0);
        text
        .transition()
        .delay(Constants.transitionTime) 
        .duration(Constants.transitionTime)
        .style('opacity', 1);

        return {rect, text}; 
    }

    /**
     * Undraws character pairing rect at specific xPos, yPos. Writes the characterNames to 
     * the center of the rect 
     * @param elements
     */
    function undrawRect(elements) {
        if(elements){
            elements.rect
            .transition()
            .duration(500)
            .ease(d3.easeCubicOut)
            .attr('width', 0)
            .remove();

        elements.text
            .transition()
            .duration(500)
            .ease(d3.easeCubicOut)
            .style('opacity', 0)
            .remove();
        }
    }

    /**
     * Character specific unhiglight when drawing rect and scrolling down 
     * for currentStep = 6, currentStep = 7
     * @param characterList
     * @param y
     * @param index
     */
    function characterPairingUnhighlight(characterList, y, index) {
        const elements = document.querySelectorAll('.highlight, .unhighlight');
        const elementsToUnhighlight = [];

        elements.forEach(element => {
            const textContent = element.textContent;
            if (characterList.includes(textContent)) {
                elementsToUnhighlight.push(element);
            }
        });

        if (elementsToUnhighlight.length > 0) {
            unhighlightSentences(elementsToUnhighlight);
        }

        const arr = showDescriptions ? drawRect(0, y, characterList, Constants.colors[index]) : null;
        return arr;
    }

    /**
     * Character specific unhiglight when undrawing rect and scrolling up
     * for currentStep = 6, currentStep = 7
     * @param characterList
     * @param epRectText
     */
    function characterPairingHighlight(characterList, epRectText) {
        const elements = document.querySelectorAll('.unhighlight');
        const elementsToHighlight = [];

        elements.forEach(element => {
            const textContent = element.textContent;
            if (characterList.includes(textContent)) {
                elementsToHighlight.push(element);
            }
        });

        if (elementsToHighlight.length > 0) {
            highlightSentences(elementsToHighlight);
        }

        undrawRect(epRectText); 
    }  

    /**
     * Resets all highlight/unhighlight spans when scrolled up to currentStep =0
     */
    function reset(){
        const unhiglightedElements = document.querySelectorAll('.unhighlight');
        unhiglightedElements.forEach(element => {
            element.style.animation = 'none';
            requestAnimationFrame(() => {
                element.style.animation = '';
                element.classList.remove('unhighlight');
                element.classList.add('highlight');
            });
        });
    }


    $: (() => {
        // scrolling down
        if (currentStep > previousStep) {
            if (currentStep == 0) {
                showDescriptions.set(false);
            } else if (currentStep == 1) {
                showDescriptions.set(true);
            } else if (currentStep == 2) {
                highlightDescription1();
                highlightDescription2(); 
                highlightDescription3(); 
            } else if (currentStep == 3) {
                if (specificDataPoint) {
                    newDescription3 = setSentenceHighlight(specificDataPoint[`Wikipedia Episode Descriptions`], specificDataPoint[`Wikipedia Clauses Analysis`]);
                    setTimeout(() => {
                        highlightDescription3(); 
                    }, 0);
                } else {
                    console.log('Step 3: Data not loaded yet');
                }
            } else if (currentStep == 4) {
                if (specificDataPoint) {
                    characterHighlights[0] = setCharacterHighlight(specificDataPoint[`Episode Description`], specificDataPoint[`Episode Description Filtered`]); 
                    characterHighlights[1] = setCharacterHighlight(specificDataPoint[`Wiki Fandom Descriptions`], specificDataPoint[`Wiki Fandom Description Filtered`]); 
                    characterHighlights[2] = setCharacterHighlight(specificDataPoint[`Wikipedia Episode Descriptions`], specificDataPoint[`Wikipedia Clauses Filtered`]);
                    setTimeout(() => {
                        highlightDescription1();
                        highlightDescription2(); 
                        highlightDescription3(); 
                    }, 0);
                } else {
                    console.log('Step 3: Data not loaded yet');
                }
            } else if (currentStep == 5){
                episodeRectText[0] = characterPairingUnhighlight(specificDataPoint[`Streamlined Characters`][2], rectYPos, 0);
                rectYPos+=rectYPosIncrement; 
            } else if (currentStep == 6){
                episodeRectText[1] = characterPairingUnhighlight(specificDataPoint[`Streamlined Characters`][1], rectYPos, 2);
                rectYPos+=rectYPosIncrement; 
            } else if (currentStep == 7){
                episodeRectText[2]= characterPairingUnhighlight(specificDataPoint[`Streamlined Characters`][0], rectYPos, 1);
                rectYPos+=rectYPosIncrement; 
            }
            // } else if (currentStep == 8){
            //     showDescriptions.set(false);
            //     if(heatMap) {
            //         // console.log("heat map"); 
            //         heatMap.classList.add('svg-container'); // Toggle a new class
            //         heatMap.style.backgroundColor = 'yellow'; // Change background color

            //         // const newWidth = 0.45*window.innerWidth; 
            //         // const newHeight = 0.95*window.innerHeight

            //         // specificEpisodeGroup.selectAll("rect")
            //         //     .transition()
            //         //     .duration(1000)
            //         //     .attr("width", 0)
            //         //     .attr("height", 0);

            //         // setTimeout(() => {d3.select(episodeSvg).attr("width", newWidth).attr("height", newHeight).attr("viewBox", `0 0 ${newWidth} ${newHeight}`)}, 1000); 
                                
            //     }
            // }
        // scrolling up
        } else if (currentStep < previousStep) {
            if (currentStep == 0) {
                showDescriptions.set(false);
                reset(); 
            } else if (currentStep == 1) {
                unhighlightDescription1();
                unhighlightDescription2();
                unhighlightDescription3();
            } else if (currentStep == 2) {
                setTimeout(() => {
                    highlightDescription3();
                }, 0);
            } else if (currentStep == 3) {
                setTimeout(() => {
                    highlightDescription1();
                    highlightDescription2();
                    highlightDescription3();
                }, 0);
            } else if (currentStep == 4) {
                characterPairingHighlight(specificDataPoint[`Streamlined Characters`][2], episodeRectText[0])
                rectYPos -= rectYPosIncrement;
            } else if (currentStep == 5) {
                characterPairingHighlight(specificDataPoint[`Streamlined Characters`][1], episodeRectText[1])
                rectYPos -= rectYPosIncrement;
            } else if (currentStep == 6) {
                characterPairingHighlight(specificDataPoint[`Streamlined Characters`][0], episodeRectText[2])
                rectYPos -= rectYPosIncrement;
            }
            // } else if (currentStep == 7) {
            //     showDescriptions.set(true);
            // }
        }
        previousStep = currentStep;

        rectWidth = 0.25*window.innerWidth; 
        rectYPosIncrement = rectWidth/3; 
    })();

</script>

<section class="episode-section webpage-section">
    <Scroll bind:value={currentStep}>
        {#each steps as text, i}
            <div class="step" class:active={currentStep === i}>
                <div class="step-content">
                    {@html text}
                </div>
            </div>
        {/each}
    </Scroll>   

    <div class="chart">
        <div id="col1"> 
            <div bind:this={heatMap}>
                <svg bind:this={episodeSvg} width={rectWidth} height={rectWidth} viewbox="0 0 {rectWidth} {rectWidth}">
                    <rect bind:this={baseRect} x={0} y={0} width={rectWidth} height={rectWidth} fill="none" stroke="black" stroke-width="2"></rect>
                </svg>
            </div>
            <div id="officialDescription" class="episodeDescriptions" class:active={$showDescriptions}>
                <span class="italic">Description 1</span>
                <br>
                {#if currentStep < 4}
                {@html episodeDescriptions[0]}
                {:else}
                    {@html characterHighlights[0]}
                {/if}
            </div>
            <div id="wikifandomDescription" class="episodeDescriptions" class:active={$showDescriptions}> 
                <span class="italic">Description 2</span>
                <br>
                {#if currentStep < 4}
                {@html episodeDescriptions[1]}
                {:else}
                    {@html characterHighlights[1]}
                {/if}
            </div>
            <div id="wikipediaDescription" class="episodeDescriptions" class:active={$showDescriptions}>  
                <span class="italic">Description 3</span>
                <br>
                {#if currentStep < 3}
                    {@html episodeDescriptions[2]}
                {:else if currentStep == 3}
                    {@html newDescription3}
                {:else if currentStep > 3}
                    {@html characterHighlights[2]}
                {/if}
            </div>
        </div>
        <!-- <div id="col2">
           
        </div> -->
    </div>  
</section>


<style>
    .episode-section {
        display: flex;
        justify-content: center;
        gap: calc(var(--margin)*2); 
    }

    .chart {
        width: fit-content;
        height: fit-content;
        position: sticky;
        top: 10vh;
        display: flex; 
        flex-direction: row;
        align-items: center;
        /* gap: var(--margin); */
        /* padding-left:calc(var(--margin)*2);  */
    }

    #col1 {
        display: flex; 
        flex-direction: column;
        gap: calc(var(--margin)/2); 
        width: 25vw;
        justify-content: center;
        /* max-width: 75%;  */
    }
    /* 
    #col2 {
        max-width: 50%; 
    } */

    /* #wikifandomDescription {
        margin-top: 0.3rem; 
    } */

    /* #wikipediaDescription {
        max-width: 80%; 
    } */

    .episodeDescriptions {
        opacity: 0;
        transition: opacity var(--transition-time) ease;
        font-size: var(--label-font-size);
        width: inherit; 
    }

    .episodeDescriptions.active {
        opacity: 1;
    }

    /* Scrollytelling CSS */
    .step {
        height: 55vh;
        max-width: 25vw; 
        display: flex;
        place-items: center;
        justify-content: center;
        align-items: flex-start;
    }

    .step-content {
        /* max-width: 35vw;  */
        background: var(--white);
        opacity: 0.2; 
        color: var(--black);
        padding: var(--margin);
        display: flex;
        flex-direction: column;
        justify-content: center;
        transition: background-color var(--transition-time) ease;
        z-index: 10;
    }

    .step.active .step-content {
        opacity: 1;  
    }
</style>
