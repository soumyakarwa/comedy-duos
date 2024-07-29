<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    import { writable } from 'svelte/store';
    import * as Constants from "./Constants.js"; 
    import {addOrUpdateLine, addOrUpdateThumbPin, removeThumbPin} from "./Util.js"; 

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
    let rectWidth = 0;
    let rectYPosIncrement;
    let episodeSection; 
    let svgWidth, svgHeight; 
    let connectingLine = false; 
    let oolongSlayerGif; 
    let contentDivWidth, chartDivWidth, chartTop, contentTop; 
    let gifContainer; 

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
    let test = {ellipse: null, pos: null}; 

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
        svgWidth = episodeSection.getBoundingClientRect().width;
        svgHeight = episodeSection.getBoundingClientRect().height;

        contentTop = contentDiv.offsetTop; 
        chartTop = chartDiv.offsetTop; 
        contentDivWidth = contentDiv.offsetWidth;
        chartDivWidth = chartDiv.offsetWidth;

        leftPin.pos = [contentDiv.offsetLeft+contentDivWidth/2, contentTop]; 
        rightPin.pos = [chartDiv.offsetLeft+chartDivWidth/2, chartTop]; 

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (!connectingLine) {
                        connectingLine = true;
                        addOrUpdateThumbPin(svg, leftPin); 
                        addOrUpdateThumbPin(svg, rightPin); 

                        let contentOriginPin;
                        let chartOriginPin; 
                        // console.log(contentDiv.getBoundingClientRect(), ); 
                        if (window.innerWidth < Constants.tabletSize || window.innerWidth === Constants.tabletSize) {
                            test.pos = [svgWidth * 0.5, contentTop + contentDiv.offsetHeight]; 
                            addOrUpdateThumbPin(svg, test); 
                            contentOriginPin = test.pos;
                            chartOriginPin = [svgWidth * 0.5, 0]; 
                        } else {
                            contentOriginPin = [svgWidth * 0.625, 0];
                            chartOriginPin = [svgWidth * 0.375, 0]; 
}

                        addOrUpdateLine(svg, topLeft, chartOriginPin, leftPin.pos); 
                        addOrUpdateLine(svg, topRight, contentOriginPin, rightPin.pos); 
                    }
                }
            });
        }, {
            threshold: 0.5 // Adjust this threshold as needed
        });
        
        observer.observe(episodeSection);

        window.addEventListener('resize', () => {
            svgWidth = episodeSection.getBoundingClientRect().width;
            svgHeight = episodeSection.getBoundingClientRect().height;

            contentTop = contentDiv.offsetTop; 
            chartTop = chartDiv.offsetTop; 
            contentDivWidth = contentDiv.offsetWidth;
            chartDivWidth = chartDiv.offsetWidth;

            leftPin.pos = [contentDiv.offsetLeft+contentDivWidth/2, contentTop]; 
            rightPin.pos = [chartDiv.offsetLeft+chartDivWidth/2, chartTop]; 

            let initialRectYPosIncrement = rectYPosIncrement;

            if(gifContainer){
                if(window.innerWidth < Constants.tabletSize || window.innerWidth === Constants.tabletSize){
                    rectWidth = 0.5 * gifContainer.getBoundingClientRect().width; 
                }
                else {
                    rectWidth = gifContainer.getBoundingClientRect().width
                }
            }
            
            const newRectYPosIncrement = rectWidth / 3; 
        
            let initialRectYPos = rectYPos; 
            const changeInIncrement = newRectYPosIncrement - initialRectYPosIncrement;
            rectYPos = initialRectYPos + changeInIncrement * (rectYPos / initialRectYPosIncrement);
            
            rectYPosIncrement = newRectYPosIncrement;
            
            episodeSvg.setAttribute("width", rectWidth);
            episodeSvg.setAttribute("height", rectWidth);
            episodeSvg.setAttribute("viewBox", `0 0 ${rectWidth} ${rectWidth}`);

            if(connectingLine){
                addOrUpdateThumbPin(svg, leftPin)
                addOrUpdateThumbPin(svg, rightPin)

                let contentOriginPin;
                let chartOriginPin; 
                
                test.pos = [svgWidth * 0.5, contentTop + contentDiv.offsetHeight]; 
                
                if (window.innerWidth < Constants.tabletSize || window.innerWidth === Constants.tabletSize) {
                    addOrUpdateThumbPin(svg, test); 
                    test.ellipse.attr("opacity", 1); 
                    contentOriginPin = test.pos;
                    chartOriginPin = [svgWidth * 0.5, 0]; 
                } else {
                    contentOriginPin = [svgWidth * 0.625, 0];
                    chartOriginPin = [svgWidth * 0.375, 0]; 

                    if(test.ellipse){
                        removeThumbPin(svg, test); 
                    }
                }

                addOrUpdateLine(svg, topLeft, chartOriginPin, leftPin.pos); 
                addOrUpdateLine(svg, topRight, contentOriginPin, rightPin.pos); 
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
            if (currentStep == 0) {
                showDescriptions.set(false);
            } else if (currentStep == 1) {
                showDescriptions.set(true);
                oolongSlayerGif.style.opacity = 0; 
                heatMap.style.opacity = 1; 
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
                oolongSlayerGif.style.opacity = 1; 
                heatMap.style.opacity = 0; 
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

        if(gifContainer){
            if(window.innerWidth < Constants.tabletSize || window.innerWidth === Constants.tabletSize){
                rectWidth = 0.75 * gifContainer.getBoundingClientRect().width; 
            }
            else {
                rectWidth = gifContainer.getBoundingClientRect().width
            }
        }
        rectYPosIncrement = rectWidth/3; 
    })();
</script>

<section bind:this={episodeSection} class="episode-section" id="episode-breakdown-section">
    <div class="content divBorder" bind:this={contentDiv}>
        <!-- <img id="episode-pin" src="/assets/pins/pin.svg" alt="thumb pin" class="thumb-pin"/> -->
        {@html Constants.episodeBreakdownText[currentStep]}
    </div>

    <div class="chart divBorder" bind:this={chartDiv}>
        <!-- <img id="chart-pin" src="/assets/pins/pin.svg" alt="thumb pin" class="thumb-pin"/> -->
        <div id="col1"> 
            <div bind:this={gifContainer} class="container">
                <div bind:this={oolongSlayerGif} id="oolongSlayerGif" class="overlay">
                    <img width={0.95*rectWidth} src="assets/oolongSlayer.gif" alt="oolong slayer episode gif"/>
                    <div id="oolong-slayer-content">
                        <div class="italic">Season 3, Episode 4</div>
                        <div>The Oolong Slayer</div>
                        <br>
                        <div>⭐ 8.5/10</div>
                    </div>
                </div>
                <div bind:this={heatMap} class="base">
                    <svg bind:this={episodeSvg} width={rectWidth} height={rectWidth} viewBox="0 0 {rectWidth} {rectWidth}">
                        <rect bind:this={baseRect} x={0} y={0} width={rectWidth} height={rectWidth} fill="none" stroke="black" stroke-width="2"></rect>
                    </svg>
                </div>
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
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: center;
        gap: calc(var(--margin)*2);
    }

    .container {
        position: relative;
        width: 100%;
        height: fit-content;
        display: flex; 
        align-items: center;
        justify-content: center;
    }

    .base {
        position: relative;
        z-index: 1;
        opacity: 0; 
        transition: opacity var(--transition-time);
    }

    #oolongSlayerGif {
        position: absolute;
        padding: calc(var(--margin)*0.5); 
        top: 0;
        /* left: 2.5%;  */
        z-index: 2;
        pointer-events: none;
        transition: opacity var(--transition-time);
        border: 1px solid black; 
    }

    #oolongSlayerGif img{
        margin-bottom: var(--margin); 
    }

    #oolong-slayer-content {
        text-align: center;
        font-size: var(--label-font-size);
    }

    #overlaySvg-episodeBreakdown {
        width: 100%; 
        height: 100%; 
    }

    .chart {
        width: fit-content;
        height: fit-content;
        margin-top: calc(var(--margin)*2); 
        /* position: absolute;  
        top: 3vh;
        left: 53vw;  */
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
        height: 28vh; 
        /* height: var(--text-box-height);  */
        margin-top: calc(var(--margin)*2); 
        padding: var(--margin); 
        background-color: var(--white);
        /* position: absolute;   */
        font-size: var(--body-font-size);
        /* top: 3vh;
        left: 20vw;  */
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

    @media (max-width: 768px) {
        .episode-section{
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: 0; 
            /* padding-top:var(--margin);  */
        }

        #col1 {
            width: 80vw; 
            /* margin-top: 0;  */
        }

        .content{
            width: 80vw; 
            height: 17vh; 
            /* height: 15vh;  */
        }

        .chart {
            /* margin-top: 0;  */
        }

        #oolongSlayerGif img{
            margin-bottom: 0; 
        }

    }

</style>
