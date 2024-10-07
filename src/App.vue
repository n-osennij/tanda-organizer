<template>
  <div id="container">
    <Header></Header>
    <Cards></Cards>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import Cards from "./components/Cards.vue";

export default {
  components: {
    Header,
    Cards,
  },
};
</script>
