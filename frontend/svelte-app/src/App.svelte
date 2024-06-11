<script>
	import LandingPage from './LandingPage.svelte';
	import Content from './Content.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
            window.scrollTo(0, 0);
    });

</script>

<main>
	<LandingPage />
	<Content />
	<LandingPage />
</main>


