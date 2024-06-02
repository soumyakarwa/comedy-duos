<script>
</script>

<style>
  .landing-page-container {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: white;
  }

.fixed-image {
    position: fixed;
    top: 0;
    left: 0;
    width: 60vw; /* Adjust this size as needed */
    height: auto;
    z-index: 10;
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


<div class="landing-page-container">
  <img src="/assets/cautionTape.svg" alt="Crime Scene Tape" class="fixed-image" />
  <div>
    <div class="title">THE MOST ICONIC DUO IN</div>
    <div class="subtitle">BROOKLYN<br><span class="hel">NINE-NINE</span><br>
    </div>
    <div class="author">by Soumya Karwa</div>
  </div>
</div>
