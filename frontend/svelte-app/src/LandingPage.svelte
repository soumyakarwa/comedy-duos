<script>
window.addEventListener('DOMContentLoaded', () => {
  const line = document.getElementById('line1');
  const pinBottom1 = document.querySelector('.case-container #case-pin-bottom-1');
  const pinTop1 = document.querySelector('.title-container #case-pin-top-1');

  function updateLinePosition() {
    const pinBottom1Rect = pinBottom1.getBoundingClientRect();
    const pinTop1Rect = pinTop1.getBoundingClientRect();

    const startX = pinBottom1Rect.left + (pinBottom1Rect.width / 2) + window.scrollX;
    const startY = pinBottom1Rect.top + (pinBottom1Rect.height / 2) + window.scrollY;
    const endX = pinTop1Rect.left + (pinTop1Rect.width / 2) + window.scrollX;
    const endY = pinTop1Rect.top + (pinTop1Rect.height / 2) + window.scrollY;

    line.setAttribute('x1', startX);
    line.setAttribute('y1', startY);
    line.setAttribute('x2', endX);
    line.setAttribute('y2', endY);
  }

  // Initial call to set the line position
  updateLinePosition();

  // Recalculate the line position if the window is resized
  window.addEventListener('resize', updateLinePosition);

  // Recalculate the line position if the window is scrolled
  window.addEventListener('scroll', updateLinePosition);
});

</script>


<div class="landing-page-container">
  <div class="case-container">
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-top-1"/>
    <div id="case">CASE: 725ZA-52ZN</div>
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-bottom-1"/>
  </div>
  <div class="title-container">
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-top-1"/>
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-top-2"/>
    <div class="title">THE MOST ICONIC DUO IN</div>
    <div class="subtitle">BROOKLYN<br><span class="hel">NINE-NINE</span><br></div>
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-bottom-1"/>
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-bottom-2"/>
  </div>
  <div class="name-container">
    <img src="/assets/pin.svg" alt="thumb pin" class="thumb-pin" id="case-pin-top-1"/>
    <div id="case-detective">CASE DETECTIVE<br>Soumya Karwa</div>
  </div>
</div>

<style>
  .landing-page-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    /* background-color: white; */
  }

  /* FOR TOP LEFT HAND CORNER DIV */
  .case-container {
    background-color: var(--white); 
    padding: calc(var(--margin)/2); 
    align-self: flex-start;
    margin-top: calc(var(--margin)*2); 
    margin-left: calc(var(--margin)*2); 
    position: relative; /* Ensure the thumb pin is positioned relative to this container */
  }

  .case-container #case-pin-top-1 {
    top: -0.5rem; 
    left: 47%; 
  }

  .case-container #case-pin-bottom-1 {
    top: 5rem; 
    left: 92%; 
  }

  #case {
    font-size: calc(var(--title-font-size) * 6/10); 
    font-family: "Impact"; 
  }

  /* FOR CENTER DIV */
  .title-container {
    background-color: var(--white);
    padding: calc(var(--margin)/2) var(--margin); 
    position: relative; /* Ensure the thumb pin is positioned relative to this container */
  }

  .title {
    /* font-size 5.5rem;  */
    font-size: var(--title-font-size);
    font-family: "Impact"; 
    margin-bottom: var(--margin); 
  }

  .subtitle {
    /* font-size: 9.5rem; */
    font-size: calc(var(--title-font-size) * 9.5/5.5); 
    color: var(--yellow); /* Gold color */
    font-family: "Impact";
    line-height: 0.6; 
    margin-bottom: calc(var(--margin)*1.5);
  }

  .hel {
    /* font-size: 7.32rem;  */
    font-size: calc(var(--title-font-size) * 7.32/5.5); 
    font-family: "Helvetica Neue";
    font-weight: bold;
  }

  .title-container #case-pin-top-1 {
    top: -0.5rem; 
    left: 37.75%; 
  }

  .title-container #case-pin-top-2 {
    top: -0.5rem; 
    left: 99.75%; 
  }

  .title-container #case-pin-bottom-1 {
    top: 97.5%; 
    left: 45%; 
  }

  .title-container #case-pin-bottom-2 {
    top: 97.5%; 
    left: 99.75%; 
  }

  /* FOR BOTTOM RIGHT HAND CORNER DIV */
  .name-container {
    background-color: var(--white); 
    padding: calc(var(--margin)/2); 
    align-self: flex-end;
    margin-bottom: calc(var(--margin)*2); 
    margin-right: calc(var(--margin)*2); 
    position: relative;
  }

  #case-detective {
    font-size: var(--body-font-size); 
    font-family: "Impact"; 
  }

  .name-container #case-pin-top-1 {
    top: -0.5rem; 
    left: 45%; 
  }


</style>

