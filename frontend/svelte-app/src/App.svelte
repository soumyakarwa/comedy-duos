<script>
	import LandingPage from './LandingPage.svelte';
	import Content from './Content.svelte';
	import { onMount } from 'svelte';

	let episodeData = []; // Initialize with appropriate default values
	let specificDataPoint = null;

</script>

<main>
	<img src="/assets/dot-grid.svg" alt="case board dot grid" class="background-svg" />
	<Content {episodeData} {specificDataPoint}/>
</main>

<style>
	.background-svg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		stroke: var(--white);
		stroke-width: 5; 
		z-index: -1; /* Ensure it is behind other content */
	}
</style>
