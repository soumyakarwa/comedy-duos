<script>
    import Scroller from '@sveltejs/svelte-scroller';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    
    let count;
    let index = 0;
    let offset;
    let progress;
    let top = 0.1;
    let threshold = 0.5;
    let bottom = 0.9;
    
    // Array of background images
    const backgroundImages = [
      '/assets/holt.svg',
      '/assets/jake.svg',
      '/assets/amy.svg',
      '/assets/terry.svg',
      '/assets/gina.svg',
      '/assets/charles.svg',
      '/assets/rosa.svg',
    ];
  
    $: backgroundImage = backgroundImages[index] || 'defaultImage.jpg';

  // Transition state
    let imgOpacity = tweened(1, {
          duration: 300,
          easing: cubicOut
      });

      $: {
          imgOpacity.set(0);
          setTimeout(() => imgOpacity.set(1), 300);
      }

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
      <!-- <div slot="background" style="background-image: url({backgroundImage}); background-size: cover;">
      </div> -->
      <div slot="background" style="padding: 0 0 0 0;">
        <!-- svelte-ignore a11y-img-redundant-alt -->
          <img src={backgroundImage} alt="show character image" style="opacity: {$imgOpacity}">        
      </div>
  
      <div slot="foreground" style="padding: 0 25% 0 25%;">
        <section>If you don’t already know what Brooklyn Nine–Nine is (which is borderline ridiculous btw), let me bring you up to speed on one of the most iconic sitcoms of our time. A Golden Globe winner, Brooklyn Nine–Nine is a 2013–2021 workplace sitcom about Brooklyn’s 99th Precinct’s detective squad when a rule-following, outwardly-unemotional, highly decorated NYPD Captain Raymond Holt (played by Andre Braugher) takes over.</section>
        <section>Being the first openly Black Gay Police officer in the NYPD, Captain Holt has fought many uphill battles; but bringing the carefree, talented, almost irresponsible Detective Jacob Peralta (played by Andy Samberg) in line, might just be the toughest battle yet (lol I kid ofcourse). </section>
        <section>But what makes Brooklyn Nine–Nine so special is that it’s less about the crime and more about the people solving it. It’s about how their lives, their relationships, their ambitions change as a result of their experiences on the job. But set against a grim backdrop of a police precinct where more often than not, things don’t go as planned, it reminds us to find humor in life. As Jerry Seinfeld said, “Humor is the most powerful, most survival, essential quality, you will ever have or need to navigate through the human experience,” Brooklyn Nine–Nine captures viewers’ hearts by creating nuanced characters who are able to laugh at themselves and the situations they face. Reminding us “not enough of life makes sense” but “it can be survived through humor” and with the right people by your side.</section>
        <section>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</section>
        <section>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</section>
        <section>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</section>
        <section>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</section>
      </div>
    </Scroller>
  </div>
  
  <style>
    [slot="background"] {
      width: 100%; 
      height: 100%; 
      transition: opacity 0.5s ease-in-out;
      /* transition: img 0.5s ease-in-out; */
      /* width: 100%;  */
      /* height: 90vh;  */
      /* bottom: 0px;  */
    }

    [slot="background"] img {
      width: 100vw; 
      height: auto;
      transition: opacity 0.5s ease-in-out;
    }

    [slot="foreground"] {
      pointer-events: none;
    }
    
    [slot="foreground"] section {
      pointer-events: all;
    }
    
    section {
      height: 100vh;
      /* background-color: rgba(0,0,0,0.5); */
      color: black;
      padding: var(--margin);
      margin-bottom: var(--margin); 
      border: 1px solid black; 
      font-size: var(--body-font-size); 
    }
  </style>
  