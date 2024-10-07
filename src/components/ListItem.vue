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
    card_index: {
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
      this.store.openContextMenu(event, 2, {
        card_index: parseInt(this.card_index),
        item_index: parseInt(this.index),
        item: this.item
      });
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
