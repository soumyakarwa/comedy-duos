<script>
	import LandingPage from './LandingPage.svelte';
	import Content from './Content.svelte';

	let episodeData = []; // Initialize with appropriate default values
  	let specificDataPoint = null;
</script>

<main>
	<LandingPage />
	<Content {episodeData} {specificDataPoint}/>
	<LandingPage />
</main>


