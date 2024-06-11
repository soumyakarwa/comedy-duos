<script>
    import Characters from "./Characters.svelte"
    import Standalone from "./Standalone.svelte";
    import EpisodeBreakdown from "./EpisodeBreakdown.svelte";
    import HeatMap from "./HeatMap.svelte";
    import { onMount } from 'svelte';

    // let episodeSvg;
    const standaloneText = [
    `To figure out the most iconic character duo, I first needed to figure out which characters were paired together. In order to do that I consolidated three different versions of the epiode descriptions, text about what three different sources I used.`, 
    `Second paragpraph in some way about how I consolidated the three texts and analysed the language to identify pairings.`, 
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut mauris ipsum. Pellentesque venenatis mollis metus, eu mattis sapien rhoncus ac. Nam arcu dolor, suscipit consequat tortor nec, condimentum aliquet eros. Nullam posuere vel mauris vitae tincidunt.`,
    `Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed nec lacus posuere justo porttitor consectetur id sed mi. Nulla dapibus dolor a ex viverra fringilla. Fusce facilisis ligula vel dui mattis posuere.`]
    
    export let episodeData; 
    export let specificDataPoint; 

    onMount(async () => {
        try {   
            const response = await fetch("/data/brooklynNineNineCharactersStreamlined.json");
            const text = await response.text();
            episodeData = JSON.parse(text);
            specificDataPoint = episodeData.find(d => d.Title === "Into the Woods"); 
            console.log(episodeData); 
        } catch (error) {
            console.error("Error loading data:", error);
        }
    });

</script>

<Characters/>
<Standalone text={standaloneText}/>
<EpisodeBreakdown {episodeData} {specificDataPoint}/>
<HeatMap {episodeData} {specificDataPoint}/>

<style>
</style>