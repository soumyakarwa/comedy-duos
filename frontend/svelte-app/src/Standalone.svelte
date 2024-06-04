<script>
    export let text; 
</script>

<section class="standalone-section">
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
        /* height: 80vh; */
        width: 35vw;
        color: black;
        margin-left: 32.5vw; 
        font-size: var(--body-font-size);
        display: flex; 
        justify-content: center;
    }

    .desc {
        height: fit-content; 
        margin: var(--margin); 
        padding: var(--margin); 
    }
</style>