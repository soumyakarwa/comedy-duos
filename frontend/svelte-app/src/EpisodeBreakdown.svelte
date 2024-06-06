<script>
    import Scroll from "./Scrolly.svelte";
    import { tweened } from "svelte/motion";
    import * as d3 from 'd3';
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';

    let episodeData = []; 
    let specificDataPoint;
    let svg; 
    let width; 
    let episodeDescriptions = []; 
    let newDescription3;
    let characterHighlights = []; 
    let currentStep;
    let previousStep = -1; 
    const showDescriptions = writable(false);
    const colors = ["#f0ca00", "#00dae0", "#f000e8"]; 
    const steps = [`Let's consider this square to represent an episode.`, `Using three different descriptions provided me more insight, and allowed me to compare and contrast the plots for each episode.`, `Breaking the descriptions down to sentences provides insight about the different plot points.`, `Breaking down complicated sentences into clauses to improve analysis.`, `Analysing each part for character groups or pairings.`];

    function setSentenceHighlight(description, analysis) {
        let highlighted = description; 
        let correctedAnalysis = analysis
            .replace(/'sentence'/g, '"sentence"')
            .replace(/'characters'/g, '"characters"')
            .replace(/:\s*'([^']+)'/g, ': "$1"') // Replace single-quoted string values
            .replace(/:\s*\[(.*?)\]/g, (match, p1) => {
                const replacedContent = p1.replace(/'([^']+)'/g, '"$1"');
                return `: [${replacedContent}]`;
        });

        const parsedAnalyis = JSON.parse(correctedAnalysis); 
        parsedAnalyis.forEach((item, index) => {
            let sentence = item.sentence;
            let span = `<span class="highlight" style="--highlight-color: ${colors[index % colors.length]};">${sentence}</span>`;
            highlighted = highlighted.replace(sentence, span);
        });
        return highlighted;
    }

    function setCharacterHighlight(description, analysis) {
        let highlighted = description; 
        let correctedAnalysis = analysis
            .replace(/'sentence'/g, '"sentence"')
            .replace(/'characters'/g, '"characters"')
            .replace(/:\s*'([^']+)'/g, ': "$1"') // Replace single-quoted string values
            .replace(/:\s*\[(.*?)\]/g, (match, p1) => {
                const replacedContent = p1.replace(/'([^']+)'/g, '"$1"');
                return `: [${replacedContent}]`;
        });
        const parsedAnalysis = JSON.parse(correctedAnalysis);
        parsedAnalysis.forEach((item, index) => {
            let characters = item.characters;
            let sentence = item.sentence; 
            let trackSentence = sentence;
            characters.forEach((c) => {
                let span = `<span class="highlight" style="--highlight-color: ${colors[index % colors.length]};">${c}</span>`;
                sentence = sentence.replace(c, span);
            })          
            highlighted = highlighted.replace(trackSentence, sentence); 
        });
        return highlighted;
    }

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

    function highlightDescription1(){
        const description1HighlightElements = document.querySelectorAll('#officialDescription .highlight,  #officialDescription .unhighlight');
        highlightSentences(description1HighlightElements); 
    }

    function highlightDescription2(){
        const description2HighlightElements = document.querySelectorAll('#wikifandomDescription .highlight, #wikifandomDescription .unhighlight');
        highlightSentences(description2HighlightElements); 
    }

    function highlightDescription3(){
        const description3HighlightElements = document.querySelectorAll('#wikipediaDescription .highlight, #wikipediaDescription .unhighlight');
        highlightSentences(description3HighlightElements); 
    }

    function unhighlightDescription1(){
        const description1HighlightElements = document.querySelectorAll('#officialDescription .highlight');
        unhighlightSentences(description1HighlightElements); 
    }

    function unhighlightDescription2(){
        const description2HighlightElements = document.querySelectorAll('#wikifandomDescription .highlight');
        unhighlightSentences(description2HighlightElements); 
    }

    function unhighlightDescription3(){
        const description3HighlightElements = document.querySelectorAll('#wikipediaDescription .highlight');
        unhighlightSentences(description3HighlightElements); 
    }

    function reset(){
        const unhiglightedElements = document.querySelectorAll('.unhighlight');
        console.log(unhiglightedElements); 
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
        console.log(`currentStep is ${currentStep}, previousStep is ${previousStep}`);
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
            }
            else if (currentStep == 4) {
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
            }
            // scrolling up
        } else if (currentStep < previousStep) {
            // Scrolling up
            if (currentStep == 0) {
                showDescriptions.set(false);
                reset(); 
            } else if (currentStep == 1) {
                unhighlightDescription1();
                unhighlightDescription2();
                unhighlightDescription3();
            } 
            else if(currentStep == 2) {
                setTimeout(() => {
                    highlightDescription3();
                }, 0);
                }
            else if(currentStep == 3) {
                setTimeout(() => {
                    highlightDescription1();
                    highlightDescription2();
                    highlightDescription3();
                }, 0);
            }
        }
        previousStep = currentStep;
    })();
    
    onMount(async () => {
        try {   
            episodeData = await d3.csv("/data/brooklynNineNineCharacters.csv");
            specificDataPoint = episodeData.find(d => d.Title === "Hitchcock & Scully");
            console.log(specificDataPoint); 
        } catch (error) {
            console.error("Error loading data:", error);
        }

        episodeDescriptions[0] = setSentenceHighlight(specificDataPoint[`Episode Description`], specificDataPoint[`Episode Description Analysis`]); 
        episodeDescriptions[1] = setSentenceHighlight(specificDataPoint[`Wiki Fandom Descriptions`], specificDataPoint[`Wiki Fandom Description Analysis`]); 
        episodeDescriptions[2] = setSentenceHighlight(specificDataPoint[`Wikipedia Episode Descriptions`], specificDataPoint[`Wikipedia Description Analysis`]);
        console.log(characterHighlights); 
    });
</script>

<section class="episode-section">
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
            <div id="officialDescription" class="episodeDescriptions" class:active={$showDescriptions}>
                <span class="italic">Description 1</span>
                <br>
                {#if currentStep < 4}
                {@html episodeDescriptions[0]}
                {:else}
                    {@html characterHighlights[0]}
                {/if}
            </div>
            <svg width="300" height="300" viewbox="0 0 300 300" bind:this={svg}>
                <rect x={0} y={0} width={300} height={300} fill="none" stroke="black" stroke-width="2"></rect>
            </svg>
            <div id="wikifandomDescription" class="episodeDescriptions" class:active={$showDescriptions}> 
                <span class="italic">Description 2</span>
                <br>
                <!-- {@html  episodeDescriptions[1]} -->
                {#if currentStep < 4}
                {@html episodeDescriptions[1]}
                {:else}
                    {@html characterHighlights[1]}
                {/if}
            </div>
        </div>
        <div id="col2">
            <div id="wikipediaDescription" class="episodeDescriptions" class:active={$showDescriptions}>  
                <span class="italic">Description 3</span>
                <br>
                {#if currentStep < 3}
                    {@html episodeDescriptions[2]}
                {:else if currentStep == 3}
                    {@html newDescription3}
                {:else if currentStep == 4}
                    {@html characterHighlights[2]}
                {/if}
            </div>
        </div>
    </div>  
</section>

<style>
    .episode-section {
        display: flex;
        justify-content: space-evenly; 
        gap: var(--margin)
    }

    .chart {
        width: 45vw;
        height: 80vh;
        position: sticky;
        top: 10vh;
        display:flex; 
        flex-direction: row;
        align-items: center;
        gap: var(--margin);
        padding-left:calc(var(--margin)*2); 
    }

    #col1 {
        display: flex; 
        flex-direction: column;
        gap: calc(var(--margin)/2); 
        max-width: 50%; 
    }

    #col2 {
        max-width: 50%; 
    }

    #wikifandomDescription {
        margin-top: 0.3rem; 
    }

    #wikipediaDescription {
        max-width: 80%; 
        }

    .episodeDescriptions {
        opacity: 0;
        transition: opacity var(--transition-time) ease;
        font-size: var(--label-font-size);
    }

    .episodeDescriptions.active {
        opacity: 1;
    }

    /* Scrollytelling CSS */
    .step {
        height: 50vh;
        max-width: 35vw; 
        display: flex;
        place-items: center;
        justify-content: center;
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
