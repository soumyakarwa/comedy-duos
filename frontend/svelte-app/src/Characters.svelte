<script>
  import Scroller from '@sveltejs/svelte-scroller';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { easeQuadInOut } from 'd3';
  
  let count;
  let index = 0;
  let offset;
  let progress;
  let top = 0.1;
  let threshold = 0.5;
  let bottom = 0.9;
  
  // Array of background images
  const backgroundImages = [
    '/assets/non-arrow/holt.svg',
    '/assets/non-arrow/jake.svg',
    '/assets/non-arrow/amy.svg',
    '/assets/non-arrow/terry.svg',
    '/assets/non-arrow/gina.svg',
    '/assets/non-arrow/charles.svg',
    '/assets/non-arrow/rosa.svg',
  ];

  const sectionTexts = [
    `If you don’t already know what Brooklyn Nine–Nine is (which is borderline ridiculous btw), let me bring you up to speed on one of the most iconic sitcoms of our time. A Golden Globe winner, Brooklyn Nine–Nine is a 2013–2021 workplace sitcom about Brooklyn’s 99th Precinct’s detective squad when a rule-following, outwardly-unemotional, highly decorated NYPD <span class="yellow">Captain Raymond Holt</span>(played by Andre Braugher) takes over.`,
    "Being the first openly Black Gay Police officer in the NYPD, Captain Holt has fought many uphill battles; but bringing the carefree, talented, almost irresponsible Detective Jacob Peralta (played by Andy Samberg) in line, might just be the toughest battle yet (lol I kid ofcourse).",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus commodo placerat. Cras vehicula purus non eros laoreet ultrices. Suspendisse congue bibendum dolor, non eleifend nunc ullamcorper sed. Praesent pulvinar ullamcorper malesuada. Proin scelerisque purus sed nibh vulputate ultrices. Nunc vitae ullamcorper sapien, sit amet sollicitudin quam. Orci varius natoque.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus commodo placerat. Cras vehicula purus non eros laoreet ultrices. Suspendisse congue bibendum dolor, non eleifend nunc ullamcorper sed. Praesent pulvinar ullamcorper malesuada. Proin scelerisque purus sed nibh vulputate ultrices. Nunc vitae ullamcorper sapien, sit amet sollicitudin quam. Orci varius natoque.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus commodo placerat. Cras vehicula purus non eros laoreet ultrices. Suspendisse congue bibendum dolor, non eleifend nunc ullamcorper sed. Praesent pulvinar ullamcorper malesuada. Proin scelerisque purus sed nibh vulputate ultrices. Nunc vitae ullamcorper sapien, sit amet sollicitudin quam. Orci varius natoque.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus commodo placerat. Cras vehicula purus non eros laoreet ultrices. Suspendisse congue bibendum dolor, non eleifend nunc ullamcorper sed. Praesent pulvinar ullamcorper malesuada. Proin scelerisque purus sed nibh vulputate ultrices. Nunc vitae ullamcorper sapien, sit amet sollicitudin quam. Orci varius natoque.",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tempus commodo placerat. Cras vehicula purus non eros laoreet ultrices. Suspendisse congue bibendum dolor, non eleifend nunc ullamcorper sed. Praesent pulvinar ullamcorper malesuada. Proin scelerisque purus sed nibh vulputate ultrices. Nunc vitae ullamcorper sapien, sit amet sollicitudin quam. Orci varius natoque."
  ]
  
  let imgOpacity = tweened(1, {
    duration: 500,
    easing: easeQuadInOut
  });

  $: {
    imgOpacity.set(0);
    setTimeout(() => imgOpacity.set(1)); 
  }

  $: backgroundImage = backgroundImages[index] || 'defaultImage.jpg';
</script>

<div>
  <Scroller
    {top}
    {threshold}
    {bottom}
    bind:count
    bind:index
    bind:offset
    bind:progress
  >
    <div slot="background" style="padding: 0;"> 
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img src={backgroundImage} alt="show character image" style="opacity: {$imgOpacity}">        
    </div>

    <div slot="foreground" style="padding-left: 32.5vw; padding-top: 10%; width:35vw;">
      {#each sectionTexts as text}
        <section class="characters-section"><div class="description">{text}</div></section>
      {/each}
    </div>
  </Scroller>
</div>

<style>
  [slot="background"] {
    width: 100%;
    height: 100%;
  }

  [slot="background"] img {
    width: 100vw;
    height: auto;
  }

  [slot="foreground"] {
    pointer-events: none;
  }
  
  [slot="foreground"] section {
    pointer-events: all;
  }
  
  .characters-section {
    height: 80vh;
    color: black;
    padding: var(--margin);
    margin-bottom: var(--margin); 
    font-size: var(--body-font-size);
    display: flex; 
    justify-content: center;
  }

  .description {
    background-color: rgba(246, 244, 245, 0.9);
    height: fit-content; 
    padding: var(--margin); 
  }

</style>
