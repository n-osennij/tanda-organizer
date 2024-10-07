<template>
  <li :data-path="item.path" @contextmenu.prevent="openContextMenu($event, item)">
    <span>{{ index + 1 }}. </span>{{ item.title }}
  </li>
</template>

<script>
import {useStore} from "../store";

export default {
  props: {
    item: {
      type: {
        id: String,
        path: String,
        title: String,
      },
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    return {store};
  },
  methods: {
    openContextMenu(event) {
      this.store.openContextMenu(event, `You clicked on ${this.item.title}`)
    },
  }
};
</script>

<style scoped>
li {
  list-style-type: none;
  margin-left: 10px;
  cursor: default;
}

li:hover {
  background-color: #dddddd;
}
</style>
