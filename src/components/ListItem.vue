<template>
  <li
      :data-path="item.path"
      class="list-group-item"
      @contextmenu.prevent="openContextMenu"
  >
    <span>{{ index + 1 }}. </span>{{ item.title }}
    <ContextMenu
        ref="contextMenu"
        :cards="cards"
        :item="item"
        :visibleSync="isContextMenuVisible"
        @update-visible="isContextMenuVisible = $event"
        @menu-action="handleAction"
    />
  </li>
</template>

<script>
import ContextMenu from './ItemContextMenu.vue';
import {eventBus} from '../eventBus';

export default {
  components: {
    ContextMenu,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    cards: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isContextMenuVisible: false, // Состояние для отслеживания видимости меню
    };
  },
  methods: {
    openContextMenu(event) {
      eventBus.closeMenu(); // Закрываем другие меню перед открытием нового
      this.$refs.contextMenu.showMenu(event.clientX, event.clientY);
    },
    handleAction(action, item) {
      console.log(`Action "${action}" on item`, item);
    },
  },
};
</script>

<style scoped>
.list-group-item {
  list-style-type: none;
  margin-left: 10px;
  cursor: default;
}

.list-group-item:hover {
  background-color: #dddddd;
}
</style>
