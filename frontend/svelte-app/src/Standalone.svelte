<script>
    export let text; 
</script>

<section class="standalone-section webpage-section">
    <div class="desc">
        <img id="standalone-pin" src="/assets/pin.svg" alt="thumb pin" class="thumb-pin"/>
        <img id="standalone-bottom-pin" src="/assets/pin.svg" alt="thumb pin" class="thumb-pin"/>
        {text[0]}
        <br>
        {#each text.slice(1) as t}
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
        
        /* background-color: var(--white);  */
    }

    .desc {
        position: relative; 
        width: var(--text-box-width);
        height: fit-content; 
        padding: var(--margin); 
        background: var(--white); 
    }

    #standalone-pin {
        top: -0.5rem;
        left: 50%; 
    }

    #standalone-bottom-pin {
        top: 99%;
        left: 50%; 
    }

</style>