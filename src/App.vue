<template>
  <div id="container">
    <Header/>
    <Cards/>
    <ContextMenu/>
  </div>
</template>
<script>
import Header from "./components/Header.vue";
import Cards from "./components/Cards.vue";
import ContextMenu from "./components/ContextMenu.vue";

export default {
  components: {
    Header,
    Cards,
    ContextMenu,
  },
};
</script>
