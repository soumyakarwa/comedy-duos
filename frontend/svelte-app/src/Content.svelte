<script>
    import LandingPage from "./LandingPage.svelte";
	import Characters from "./Characters.svelte";
	import Standalone from "./Standalone.svelte";
	import EpisodeBreakdown from "./EpisodeBreakdown.svelte";
	import HeatMap from "./HeatMap.svelte";
	import { onMount } from 'svelte';
    import * as Constants from "./Constants.js"; 

    const pageSections = [
        { component: LandingPage, subSteps: 0},
        { component: Standalone, subSteps: 0},
        { component: Characters, subSteps: Constants.characterSectionText.length-1},
        { component: Standalone, subSteps: 0},
        { component: EpisodeBreakdown, subSteps: Constants.episodeBreakdownText.length-1},
        { component: HeatMap, subSteps: Constants.heatMapSectionText.length-1, index: 5},
        { component: Standalone, subSteps: 0},
        { component: Standalone, subSteps: 0}
    ];

	export let episodeData;
	export let specificDataPoint;
    export let standaloneIntroduction = 
    {svg: null, index: 1,top: true, bottom: true, lineTop: [[0.455, 0]], lineBottom: [[0.5, 1]]}; 
    export let firstStandaloneBoolean = 
    {svg: null, index: 2, top: false, bottom: true, lineTop: [[0.5, 0]], lineBottom: [[0.375, 1], [0.625, 1]]}; 
    export let secondStandaloneBoolean = 
    {svg: null, index: 3,top: false, bottom: false, lineTop: null, lineBottom: null}; 
    export let standaloneNotes = 
    {svg: null, index: 4,top: false, bottom: false, lineTop: null, lineBottom: null}; 

    let container;
    let currentIndex = 0;
    let subIndexes = Array(pageSections.length).fill(0);
    

	function handleKeydown(event) {
        if (event.key === 'ArrowRight') {
        if (subIndexes[currentIndex] < pageSections[currentIndex].subSteps) {
            subIndexes[currentIndex]++;
        } else if (currentIndex < pageSections.length - 1) {
            currentIndex++;
        }
        } else if (event.key === 'ArrowLeft') {
        if (subIndexes[currentIndex] > 0) {
            subIndexes[currentIndex]--;
        } else if (currentIndex > 0) {
            currentIndex--;
        }
        }
    }


	onMount(async () => {
		try {
			const response = await fetch("/data/brooklynNineNineCharactersStreamlined.json");
			const text = await response.text();
			episodeData = JSON.parse(text);
			specificDataPoint = episodeData.find(d => d.Title === "The Funeral");
		} catch (error) {
			console.error("Error loading data:", error);
		}

        window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};

	});

    document.addEventListener('wheel', (e) => {
		e.preventDefault();
	}, { passive: false });

	document.addEventListener('touchmove', (e) => {
		e.preventDefault();
	}, { passive: false });

    $: if (container) {
        container.style.transform = `translateY(-${(currentIndex) * 100}vh)`;
    }

</script>

<div bind:this={container} class="container">
    <div class="section" ><LandingPage/></div>
    <div class="section"><Standalone text={Constants.standaloneIntroduction} connectionBoolean={standaloneIntroduction} /></div>
    <div class="section"><Characters currentTextIndex={subIndexes[2]}/></div>
    <div class="section"><Standalone text={Constants.standaloneText1} connectionBoolean={firstStandaloneBoolean}/></div>
    <div class="section"><EpisodeBreakdown {episodeData} {specificDataPoint} currentStep={subIndexes[4]}/></div>
    <div class="section"><HeatMap {episodeData} {specificDataPoint} index={subIndexes[5]}/></div>
    <div class="section"><Standalone text={Constants.standaloneConclusion} connectionBoolean={secondStandaloneBoolean}/></div>
    <div class="section"><Standalone text={Constants.standaloneNotes} connectionBoolean={standaloneNotes}/></div>
</div>

<style>
.container {
    transition: transform var(--transition-time) ease-in-out;
    will-change: transform;
}

.section {
    height: 100vh;
    width: 100vw;
}

</style>
