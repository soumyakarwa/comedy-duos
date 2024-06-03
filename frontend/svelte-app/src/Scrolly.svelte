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
    '/assets/arrow/holt.svg',
    '/assets/arrow/jake.svg',
    '/assets/arrow/amy.svg',
    '/assets/arrow/terry.svg',
    '/assets/arrow/gina.svg',
    '/assets/arrow/charles.svg',
    '/assets/arrow/rosa.svg',
  ];

  const sectionTexts = [
    "If you don’t already know what Brooklyn Nine–Nine is (which is borderline ridiculous btw), let me bring you up to speed on one of the most iconic sitcoms of our time. A Golden Globe winner, Brooklyn Nine–Nine is a 2013–2021 workplace sitcom about Brooklyn’s 99th Precinct’s detective squad when a rule-following, outwardly-unemotional, highly decorated NYPD Captain Raymond Holt (played by Andre Braugher) takes over.",
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
    // imgOpacity.set(Math.min((offset||0),1));
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

    <div slot="foreground" style="padding-left: 30vw; padding-top: 10%">
      {#each sectionTexts as text}
        <section><div class="description">{text}</div></section>
      {/each}
    </div>
  </Scroller>
</div>

<style>
  [slot="background"] {
    width: 100%;
    height: 100%;
    /* background-color: var(--yellow); */
    /* transition: img 0.5s; */
  }

  [slot="background"] img {
    width: 100vw;
    height: auto;
  }
/* 
  .character {
    width: 100vw;
    height: 100%;
    transition: background-image 0.5s ease-in-out;
  }  */

  [slot="foreground"] {
    pointer-events: none;
  }
  
  [slot="foreground"] section {
    pointer-events: all;
  }
  
  section {
    height: 80vh;
    width: 40vw;
    color: black;
    padding: var(--margin);
    margin-bottom: var(--margin);
    /* border: 1px solid black; */
    font-size: var(--body-font-size);
  }

  .description{
    background-color: rgba(255, 255, 255, 0.6);
    max-width: 80%;
    padding: var(--margin); 
  }

</style>
