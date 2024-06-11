<script>
	import LandingPage from './LandingPage.svelte';
	import Content from './Content.svelte';
	import { onMount } from 'svelte';

	let episodeData = []; // Initialize with appropriate default values
  	let specificDataPoint = null;

	onMount(() => {
            window.scrollTo(0, 0);
    });

</script>

<main>
	<LandingPage />
	<Content {episodeData} {specificDataPoint}/>
	<LandingPage />
</main>


