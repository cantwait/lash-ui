<template>
  <div class="loading">
     <atom-spinner
          :animation-duration="1000"
          :size="60"
          :color="'#ff1d5e'"
     />
  </div>
</template>

<script>
  import { AtomSpinner, FlowerSpinner } from 'epic-spinners';

  export default {
    components: {
      AtomSpinner,
      FlowerSpinner,
    },
  };

</script>
<style scoped>
  /* Absolute Center Spinner */
.loading {
  position: fixed;
  z-index: 999;
  height: 2em;
  width: 2em;
  overflow: show;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

/* Transparent Overlay */
.loading:before {
  content: '';
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.3);
}
</style>
