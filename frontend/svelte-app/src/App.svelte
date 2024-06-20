<script>
	import LandingPage from './LandingPage.svelte';
	import Content from './Content.svelte';

	let episodeData = []; // Initialize with appropriate default values
  	let specificDataPoint = null;
	let currentSection = 0;

	const handleNext = () => {
		console.log(currentSection)
		if (currentSection < 4) currentSection += 1; // Update based on the number of sections you have
	};

	const handlePrev = () => {
		if (currentSection > 0) currentSection -= 1;
	};

	const handleKeyDown = (event) => {
		if (event.key === "ArrowRight") handleNext();
		if (event.key === "ArrowLeft") handlePrev();
	};

</script>

<main on:click={handleNext} on:keydown={handleKeyDown}>
	<img src="/assets/dot-grid.svg" alt="case board dot grid" class="background-svg" />
	<LandingPage />
	<Content {episodeData} {specificDataPoint} {currentSection}/>
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
		/* background-size: cover; */
	}

	main {
        outline: none; /* Ensure the element can be focused for keydown events */
    }

  </style>

