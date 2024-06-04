<script>
    import Characters from "./Characters.svelte"
    import Standalone from "./Standalone.svelte";

    const standaloneText = [`To figure out the most iconic character duo, I first needed to figure out which characters were paired together. In order to do that I consolidated three different versions of the epiode descriptions, text about what three different sources I used.`, `Second paragpraph in some way about how I consolidated the three texts and analysed the language to identify pairings.`]
</script>

<Characters/>
<Standalone text={standaloneText}/>

<style>
</style>