<script>
    import LandingPage from "./LandingPage.svelte";
	import Characters from "./Characters.svelte";
	import Standalone from "./Standalone.svelte";
	import EpisodeBreakdown from "./EpisodeBreakdown.svelte";
	import HeatMap from "./HeatMap.svelte";
	import { onMount } from 'svelte';
    import * as Constants from "./Constants.js"; 

    // const pageSections = [LandingPage, Characters, Standalone, EpisodeBreakdown, HeatMap, Standalone]

    const pageSections = [
        { component: LandingPage, subSteps: 0 },
        { component: Characters, subSteps: 6 },
        { component: Standalone, subSteps: 0 },
        { component: EpisodeBreakdown, subSteps: 7 },
        { component: HeatMap, subSteps: 6 },
        { component: Standalone, subSteps: 0 }
    ];

	export let episodeData;
	export let specificDataPoint;
    let container;
    let currentIndex = 0;
    let subIndexes = Array(pageSections.length).fill(0);
    

	function handleKeydown(event) {
        if (event.key === 'ArrowRight') {
        if (subIndexes[currentIndex] < pageSections[currentIndex].subSteps) {
            subIndexes[currentIndex]++;
        } else if (currentIndex < pageSections.length - 1) {
            subIndexes[currentIndex] = 0;
            currentIndex++;
        }
        } else if (event.key === 'ArrowLeft') {
            console.log(subIndexes[currentIndex]); 
        if (subIndexes[currentIndex] > 0) {
            console.log(pageSections[currentIndex]);
            console.log(subIndexes[currentIndex]);
            subIndexes[currentIndex]--;
        } else if (currentIndex > 0) {
            subIndexes[currentIndex] = 0;
            currentIndex--;
        }
        }
    }


	onMount(async () => {
		try {
			const response = await fetch("/data/brooklynNineNineCharactersStreamlined.json");
			const text = await response.text();
			episodeData = JSON.parse(text);
			specificDataPoint = episodeData.find(d => d.Title === "Into the Woods");
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
    <div class="section"><LandingPage/></div>
    <div class="section"><Characters currentTextIndex={subIndexes[1]}/></div>
    <div class="section"><Standalone text={Constants.standaloneText1}/></div>
    <div class="section"><EpisodeBreakdown {episodeData} {specificDataPoint} currentStep={subIndexes[3]}/></div>
    <div class="section"><HeatMap {episodeData} {specificDataPoint} index={subIndexes[4]}/></div>
    <div class="section"><Standalone text={Constants.standaloneText1}/></div>
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
