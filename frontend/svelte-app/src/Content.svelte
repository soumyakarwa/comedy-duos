<script>
    import Characters from "./Characters.svelte"
    import Standalone from "./Standalone.svelte";
    import EpisodeBreakdown from "./EpisodeBreakdown.svelte";
    import HeatMap from "./HeatMap.svelte";

    // let episodeSvg;
    const standaloneText = [
    `To figure out the most iconic character duo, I first needed to figure out which characters were paired together. In order to do that I consolidated three different versions of the epiode descriptions, text about what three different sources I used.`, 
    `Second paragpraph in some way about how I consolidated the three texts and analysed the language to identify pairings.`, 
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut mauris ipsum. Pellentesque venenatis mollis metus, eu mattis sapien rhoncus ac. Nam arcu dolor, suscipit consequat tortor nec, condimentum aliquet eros. Nullam posuere vel mauris vitae tincidunt.`,
    `Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed nec lacus posuere justo porttitor consectetur id sed mi. Nulla dapibus dolor a ex viverra fringilla. Fusce facilisis ligula vel dui mattis posuere.`]

    // $: if (episodeSvg) {
    //     console.log("episodeSvg is bound:", episodeSvg);
    // } else {
    //     console.log("episodeSvg is not bound yet");
    // }

</script>

<Characters/>
<Standalone text={standaloneText}/>
<EpisodeBreakdown />
<HeatMap/>

<style>
</style>