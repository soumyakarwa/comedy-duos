<script>
    export let text; 
</script>

<section class="standalone-section webpage-section">
    <div class="desc">
        {#each text as t}
            <br>
            {t}
            <br>
        {/each}
    </div>
</section>

<style>
    .standalone-section {
        height: 100vh;
        width: 100vw; 
        color: black;
        font-size: var(--body-font-size);
        display: flex; 
        justify-content: center;
        align-items: center;
    }

    .desc {
        width: 25vw;
        height: fit-content; 
        margin: var(--margin); 
        padding: var(--margin); 
    }
</style>