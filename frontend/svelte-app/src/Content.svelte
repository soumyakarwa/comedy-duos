<script>
    import LandingPage from "./LandingPage.svelte";
	import Characters from "./Characters.svelte";
    import CharactersMobile from "./CharactersMobile.svelte";
	import Standalone from "./Standalone.svelte";
	import EpisodeBreakdown from "./EpisodeBreakdown.svelte";
	import HeatMap from "./HeatMap.svelte";
	import { onMount } from 'svelte';
    import * as Constants from "./Constants.js"; 

    const pageSections = [
        { component: LandingPage, subSteps: 0},
        { component: Standalone, subSteps: 0},
        { component: Characters, subSteps: 1},
        // { component: Standalone, subSteps: 0},
        { component: EpisodeBreakdown, subSteps: Constants.episodeBreakdownText.length-1},
        { component: HeatMap, subSteps: Constants.heatMapSectionText.length-1},
        { component: Standalone, subSteps: 0},
        { component: Standalone, subSteps: 0}
    ];

	export let episodeData;
	export let specificDataPoint;
    export let standaloneIntroduction = {
        svg: null, 
        index: 1,
        top: true, 
        bottom: true, 
        lineTop: {tablet: [[0.455, 0]], desktop: [[0.455, 0]]}, 
        lineBottom: {tablet: [[0.5, 1]], desktop: [[0.5, 1]]}
    }; 
    // export let firstStandaloneBoolean = 
    // {svg: null, index: 2, top: false, bottom: true, lineTop: [[0.5, 0]], lineBottom: [[0.375, 1], [0.625, 1]]}; 
    // export let firstStandaloneBoolean = {
    //     svg: null,
    //     index: 2,
    //     top: false,
    //     bottom: true,
    //     // lineTop: {tablet: [[0.5, 0]], desktop: [[0.5, 0]]},
    //     lineTop: null,
    //     lineBottom: {tablet: [[0.5, 1]], desktop: [[0.5, 1]]},
    // };
    export let secondStandaloneBoolean = 
    {svg: null, index: 3,top: false, bottom: false, lineTop: null, lineBottom: null}; 
    export let standaloneNotes = 
    {svg: null, index: 4,top: false, bottom: false, lineTop: null, lineBottom: null}; 

    let container;
    let currentIndex = 0;
    let subIndexes = Array(pageSections.length).fill(0);
    let touchStartY = 0;
    let touchEndY = 0;
    let windowWidth = window.innerWidth;


    function handleResize() {
        const ellipses = document.querySelectorAll('ellipse');
        if(window.innerWidth < 480){
            ellipses.forEach(ellipse => {
                ellipse.setAttribute('rx', 5);
                ellipse.setAttribute('ry', 5);
            });
        }   
        else {
            ellipses.forEach(ellipse => {
                ellipse.setAttribute('rx', 6);
                ellipse.setAttribute('ry', 6);
            });
        }
        windowWidth = window.innerWidth;
    }

	function handleKeydown(event) {
        if (event.key === 'ArrowRight' || (event.type === 'touchend' && touchEndY < touchStartY)) { 
            if (subIndexes[currentIndex] < pageSections[currentIndex].subSteps) {
                subIndexes[currentIndex]++;
            } else if (currentIndex < pageSections.length - 1) {
                currentIndex++;
            }
        } else if (event.key === 'ArrowLeft' || (event.type === 'touchend' && touchEndY > touchStartY)) {
            if (subIndexes[currentIndex] > 0) {
                subIndexes[currentIndex]--;
            } else if (currentIndex > 0) {
                currentIndex--;
            }
        }
    }

    function handleTouchStart(event) {
        touchStartY = event.changedTouches[0].screenY;
    }

    function handleTouchEnd(event) {
        touchEndY = event.changedTouches[0].screenY;
        handleKeydown(event);
    }



	onMount(async () => {
		try {
			const response = await fetch("/data/brooklynNineNineCharactersStreamlined.json");
			const text = await response.text();
			episodeData = JSON.parse(text);
			specificDataPoint = episodeData.find(d => d.Title === "The Oolong Slayer");
		} catch (error) {
			console.error("Error loading data:", error);
		}

        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('resize', handleResize);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
		};

	});

    document.addEventListener('wheel', (e) => {
		e.preventDefault();
	}, { passive: false });

	// document.addEventListener('touchmove', (e) => {
	// 	e.preventDefault();
	// }, { passive: false });

    $: if (container) {
        container.style.transform = `translateY(-${(currentIndex) * 100}vh)`;
    }

</script>

<div bind:this={container} class="container">
    <div class="section" ><LandingPage/></div>
    <div class="section"><Standalone text={Constants.standaloneIntroduction} connectionBoolean={standaloneIntroduction} /></div>
    {#if windowWidth > Constants.mobileSize}
        <div class="section"><Characters currentTextIndex={subIndexes[2]}/></div>
    {:else}
        <div class="section"><CharactersMobile currentTextIndex={subIndexes[2]}/></div>
    {/if}
    
    <!-- <div class="section"><Standalone text={Constants.standaloneText1} connectionBoolean={firstStandaloneBoolean}/></div> -->
    <div class="section"><EpisodeBreakdown {episodeData} {specificDataPoint} currentStep={subIndexes[3]}/></div>
    <div class="section"><HeatMap {episodeData} {specificDataPoint} index={subIndexes[4]}/></div>
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
