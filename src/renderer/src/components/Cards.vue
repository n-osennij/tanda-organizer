<template>
  <draggable
    v-model="store.cards"
    :animation="150"
    :ghost-class="'sortable-ghost'"
    group="cards"
    item-key="id"
    @start="this.store.closeContextMenu()"
  >
    <template :key="index" v-slot:item="{ element, index }">
      <Card :card="element" :index="index" />
    </template>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
import Card from "./Card.vue";
import { useStore } from "../store";

export default {
  name: "Cards",
  components: {
    draggable,
    Card,
  },
  setup() {
    const store = useStore();
    return { store };
  },
};
</script>

<style scoped></style>
