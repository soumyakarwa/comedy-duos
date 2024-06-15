<script>
</script>

<div class="landing-page-container">
  <div class="case-container">
    <div class="case">CASE: 725ZA-52ZN</div>
  </div>
  <div class="title-container">
    <div class="title">THE MOST ICONIC DUO IN</div>
    <div class="subtitle">BROOKLYN<br><span class="hel">NINE-NINE</span><br></div>
  </div>
  <div class="name-container">
    <div id="case-detective">CASE DETECTIVE<br>Soumya Karwa</div>
  </div>
</div>

<style>

  #case-detective {
    font-size: var(--body-font-size); 
    font-family: "Impact"; 
  }

  .case-container {
    background-color: var(--white); 
    padding: calc(var(--margin)/2); 
    align-self: flex-start;
    margin-left: var(--margin); 
  }

  .name-container {
    background-color: var(--white); 
    padding: calc(var(--margin)/2); 
    align-self: flex-end;
    margin-right: var(--margin); 
  }

  .title-container {
    background-color: var(--white);
    padding: var(--margin)
    /* margin-bottom: var(--margin); */
  }

  .landing-page-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    text-align: center;
    /* background-color: white; */
  }

.fixed-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 60vw; /* Adjust this size as needed */
    height: auto;
    z-index: 20;
  }

  .case {
    font-size: calc(var(--title-font-size)/2); 
    font-family: "Impact"; 
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

  .author {
    font-size: calc(var(--body-font-size));
    margin-top: calc(var(--margin)*2); 
  }
</style>
