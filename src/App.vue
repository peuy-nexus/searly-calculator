<template>
  <div id="app">
      <Calculator />
  </div>
</template>

<script>
  import Calculator from './views/Calculator'
  export default {
    name: 'app',
    components: {
      Calculator
    }
  }
</script>

<style>
  *{
    padding: 0;
    margin: 0;
    background-color: rgb(240, 242, 245);
  }


</style>
