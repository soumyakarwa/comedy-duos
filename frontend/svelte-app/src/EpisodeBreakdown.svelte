<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { writable } from 'svelte/store';
    import * as Constants from "./Constants.js"; 
    import {addOrUpdateLine} from "./Util.js"; 

    // SVG ELEMENTS
    let episodeSvg, chartDiv, contentDiv, overlaySvg; 
    let baseRect; 
    let heatMap; 
    let episodeRectText = [
        {rect: null, texts: null, images: null, names: null},
        {rect: null, texts: null, images: null, names: null},
        {rect: null, texts: null, images: null, names: null}
    ]    
    const showDescriptions = writable(false);
    let specificEpisodeGroup; 
    let xScale; 
    let yScale; 
    let rectWidth;
    let rectYPosIncrement;
    let episodeSection; 
    let svgWidth, svgHeight; 
    let connectingLine = false; 

    export let episodeData;
    export let specificDataPoint;
    export let currentStep; 
    
    let rectYPos = 0; 
    let episodeDescriptions = []; 
    let newDescription3;
    let characterHighlights = []; 
    let previousStep = -1; 

    let leftPin = {ellipse: null, pos: null}; 
    let rightPin = {ellipse: null, pos: null}; 

    let topLeft = {line: null, startingPos: null, endingPos: null};
    let topRight = {line: null, startingPos: null, endingPos: null};

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
        const rowHeight = rectWidth / 3;
        const imageRadius = rowHeight / 4;
        const characterSpacing = imageRadius/2;

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

        const totalCharactersWidth = characterNames.length * (imageRadius * 2 + characterSpacing) - characterSpacing;
        const startX = xPos + (rectWidth - totalCharactersWidth) / 2;

        const texts = [];
        const images = []

        characterNames.forEach((name, index) => {
            const imageX = startX + index * (imageRadius * 2 + characterSpacing) + imageRadius;
            const imageY = yPos + rowHeight / 2.5;

            const image = specificEpisodeGroup
                .append('image')
                .attr('x', imageX - imageRadius)
                .attr('y', imageY - imageRadius)
                .attr('width', 0)
                .attr('height', 0)
                .attr('xlink:href', `assets/yellow-background/${name}.png`);

            image
                .transition()
                .duration(Constants.transitionTime)
                .ease(d3.easeCubicIn)
                .attr('width', imageRadius * 2)
                .attr('height', imageRadius * 2);

            const text = specificEpisodeGroup
                .append('text')
                .attr('x', imageX)
                .attr('y', imageY+ imageRadius + 15) // Adjust the y position to place text below the image
                .attr('dy', '.35em')
                .attr('text-anchor', 'middle')
                .text(name)
                .style('fill', 'black')
                .style('font-size', Constants.labelFontSize)
                .style('opacity', 0);

            text
                .transition()
                .delay(Constants.transitionTime)
                .duration(Constants.transitionTime)
                .style('opacity', 1);

        texts.push(text);
        images.push(image);
        });
        let names = characterNames; 
        return {rect, texts, images, names}; 
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

        elements.texts.forEach((t) => {
            t.transition()
            .duration(500)
            .ease(d3.easeCubicOut)
            .style('opacity', 0)
            .remove();
        })

        elements.images.forEach((i) => {
            i.transition()
            .duration(500)
            .ease(d3.easeCubicOut)
            .style('opacity', 0)
            .remove();
        })

        }
    }


    function changeHighlightColor(elements, index, isHighlight) {
        elements.forEach(element => {
            if(isHighlight){
                element.style.setProperty('--highlight-color', Constants.hexToRGBA(Constants.heatMapColors[index], 0.3));
                element.style.setProperty('color', Constants.heatMapColors[index]);
            }
            else {
                element.style.setProperty('--highlight-color', Constants.colors[index]);
                element.style.setProperty('color', Constants.blackColor);
            }
            
            // element.classList.add('highlight-animation');
        });

        highlightSentences(elements); 
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
            // unhighlightSentences(elementsToUnhighlight);
            changeHighlightColor(elementsToUnhighlight, index, true)
        }

        const arr = showDescriptions ? drawRect(0, y, characterList, Constants.heatMapColors[index]) : null;
        return arr;
    }

    /**
     * Character specific unhiglight when undrawing rect and scrolling up
     * for currentStep = 6, currentStep = 7
     * @param characterList
     * @param epRectText
     */
    function characterPairingHighlight(characterList, epRectText, index) {
        const elements = document.querySelectorAll('.highlight, .unhighlight');
        const elementsToHighlight = [];

        elements.forEach(element => {
            const textContent = element.textContent;
            if (characterList.includes(textContent)) {
                elementsToHighlight.push(element);
            }
        });

        if (elementsToHighlight.length > 0) {
            // highlightSentences(elementsToHighlight);
            changeHighlightColor(elementsToHighlight, index, false)
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

    function resizeRect(element, index){
        const rowHeight = rectWidth / 3;
        const imageRadius = rowHeight / 4;
        const characterSpacing = imageRadius/2;

        element.rect
            .transition()
            .attr('x', 0)
            .attr('y', (index * rectYPosIncrement))
            .attr('width', rectWidth)
            .attr('height', rowHeight);

        const totalCharactersWidth = element.names.length * (imageRadius * 2 + characterSpacing) - characterSpacing;
        const startX = (rectWidth - totalCharactersWidth) / 2;

        element.images.forEach((image, rowIndex) => {
            const imageX = startX + rowIndex * (imageRadius * 2 + characterSpacing) + imageRadius;
            const imageY = (index * rectYPosIncrement) + rowHeight / 2.5;

            image
                .transition()
                .attr('x', imageX - imageRadius)
                .attr('y', imageY - imageRadius)
                .attr('width', imageRadius * 2)
                .attr('height', imageRadius * 2);

            element.texts[rowIndex]
                .transition()
                .attr('x', imageX)
                .attr('y', imageY+ imageRadius + 15);
        }); 
    }

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

        rectWidth = 0.25*window.innerWidth; 
        rectYPosIncrement = rectWidth/3; 
    };

    onMount(async () => {
        const svg = d3.select(overlaySvg);
        // [svgWidth, svgHeight] = setSvgDimensions("episode-breakdown-section", svg);
        svgWidth = document.getElementById("episode-breakdown-section").getBoundingClientRect().width;
        svgHeight = document.getElementById("episode-breakdown-section").getBoundingClientRect().height;

        const top = svgHeight * 0.03; 
        const contentDiv = document.querySelector('.content');
        const contentDivWidth =contentDiv.offsetWidth;
        const leftContent = svgWidth*0.2; 
        
        const chartDiv = document.getElementById("col1");
        const chartDivWidth = chartDiv.offsetWidth;
        const rightChart = svgWidth*0.53; 

        leftPin.pos = [leftContent+contentDivWidth/2, top]; 
        rightPin.pos = [rightChart+chartDivWidth/2, top]; 

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!connectingLine) {
                        connectingLine = true;
                        addOrUpdateLine(svg, topLeft,[svgWidth * 0.375, 0], leftPin.pos); 
                        addOrUpdateLine(svg, topRight,[svgWidth * 0.625, 0], rightPin.pos); 
                    }
                }
            });
        }, {
            threshold: 0.5 // Adjust this threshold as needed
        });
        
        observer.observe(episodeSection);

        window.addEventListener('resize', () => {
            svgWidth = document.getElementById("episode-breakdown-section").getBoundingClientRect().width;
            svgHeight = document.getElementById("episode-breakdown-section").getBoundingClientRect().height;

            const top = svgHeight * 0.03; 
            const contentDiv = document.querySelector('.content');
            const contentDivWidth =contentDiv.offsetWidth;
            const leftContent = svgWidth*0.2; 
            
            const chartDiv = document.getElementById("col1");
            const chartDivWidth = chartDiv.offsetWidth;
            const rightChart = svgWidth*0.53; 

            leftPin.pos = [leftContent+contentDivWidth/2, top]; 
            rightPin.pos = [rightChart+chartDivWidth/2, top]; 

            let initialRectYPosIncrement = rectYPosIncrement;

            rectWidth = 0.25 * window.innerWidth;
            const newRectYPosIncrement = rectWidth / 3; 
        
            let initialRectYPos = rectYPos; 
            const changeInIncrement = newRectYPosIncrement - initialRectYPosIncrement;
            rectYPos = initialRectYPos + changeInIncrement * (rectYPos / initialRectYPosIncrement);
            
            rectYPosIncrement = newRectYPosIncrement;
            
            episodeSvg.setAttribute("width", rectWidth);
            episodeSvg.setAttribute("height", rectWidth);
            episodeSvg.setAttribute("viewBox", `0 0 ${rectWidth} ${rectWidth}`);

            if(connectingLine){
                addOrUpdateLine(svg, topLeft,[svgWidth * 0.375, 0], leftPin.pos); 
                addOrUpdateLine(svg, topRight,[svgWidth * 0.625, 0], rightPin.pos); 
            }

            episodeRectText.forEach((entry, i) => {
                if(entry.rect){
                    resizeRect(entry, i); 
                }
            }); 

        }); 
    });    

    $: (() => {
        // scrolling down
        if (currentStep > previousStep) {
            console.log(`scrolling down, ${currentStep}`); 
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
                episodeRectText[0] = characterPairingUnhighlight(specificDataPoint[`Streamlined Characters`][0], rectYPos, 0);
                rectYPos+=rectYPosIncrement; 
            } else if (currentStep == 6){
                episodeRectText[1] = characterPairingUnhighlight(specificDataPoint[`Streamlined Characters`][1], rectYPos, 1);
                rectYPos+=rectYPosIncrement; 
            } else if (currentStep == 7){
                episodeRectText[2]= characterPairingUnhighlight(specificDataPoint[`Streamlined Characters`][2], rectYPos, 2);
                rectYPos+=rectYPosIncrement; 
            }
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
                characterPairingHighlight(specificDataPoint[`Streamlined Characters`][0], episodeRectText[0], 0)
                rectYPos -= rectYPosIncrement;
            } else if (currentStep == 5) {
                characterPairingHighlight(specificDataPoint[`Streamlined Characters`][1], episodeRectText[1], 1)
                rectYPos -= rectYPosIncrement;
            } else if (currentStep == 6) {
                characterPairingHighlight(specificDataPoint[`Streamlined Characters`][2], episodeRectText[2], 2)
                rectYPos -= rectYPosIncrement;
            }
        }
        previousStep = currentStep;

        rectWidth = 0.25*window.innerWidth; 
        rectYPosIncrement = rectWidth/3; 
    })();
</script>

<section bind:this={episodeSection} class="episode-section" id="episode-breakdown-section">
    <div class="content divBorder" bind:this={contentDiv}>
        <img id="episode-pin" src="/assets/pins/pin.svg" alt="thumb pin" class="thumb-pin"/>
        {@html Constants.episodeBreakdownText[currentStep]}
    </div>

    <div class="chart divBorder" bind:this={chartDiv}>
        <img id="chart-pin" src="/assets/pins/pin.svg" alt="thumb pin" class="thumb-pin"/>
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
    </div>  
    <svg bind:this={overlaySvg} id="overlaySvg-episodeBreakdown"></svg>
</section>


<style>
    .episode-section {
        height: 100vh; 
        width: 100vw; 
        position: relative; 
    }

    #overlaySvg-episodeBreakdown {
        width: 100%; 
        height: 100%; 
    }

    .chart {
        width: fit-content;
        height: fit-content;
        position: absolute;  
        top: 3vh;
        left: 53vw; 
        display: flex; 
        flex-direction: row;
        align-items: center;
        background-color: var(--white); 
        z-index: 0; 
        /* gap: var(--margin); */
        /* padding-left:calc(var(--margin)*2);  */
    }

    #col1 {
        display: flex; 
        flex-direction: column;
        gap: calc(var(--margin)/2); 
        width: 25vw;
        justify-content: center;
        padding: var(--margin); 
        /* max-width: 75%;  */
    }

    .content {
        width: 25vw; 
        height: var(--text-box-height); 
        padding: var(--margin); 
        background-color: var(--white);
        position: absolute;  
        font-size: var(--body-font-size);
        top: 3vh;
        left: 20vw; 
        z-index: 0; 
    }

    #overlaySvg-episodeBreakdown {
        position: absolute; 
        display: block;
        z-index: 1;
    }

    #episode-pin {
        top: -0.5rem;
        left: 50%; 
    }

    #chart-pin {
        top: -0.5rem;
        left: 50%; 
    }

    .episodeDescriptions {
        opacity: 0;
        transition: opacity var(--transition-time) ease;
        font-size: var(--label-font-size);
        width: inherit; 
    }

    .episodeDescriptions.active {
        opacity: 1;
    }

    /* svg{
        width: 100%; 
        height: 100%;
    } */
</style>
