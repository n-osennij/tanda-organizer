<template>
  <div v-if="menu.visible"
       :style="{ top: menu.y + 'px', left: menu.x + 'px' }"
       class="context-menu"
       @click.stop
  >
    <p>{{ menu.content }}</p>
  </div>
</template>

<script>
import {useStore} from "../store";

export default {
  setup() {
    const store = useStore();
    return {store};
  },
  data() {
    return {
      menu: this.store.contextMenu,
    };
  },
  mounted() {
    // Добавляем слушатель на клик по документу
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    // Убираем слушатель при уничтожении компонента
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    handleClickOutside() {
      this.store.closeContextMenu();
    }
  }
};
</script>

<style>
.context-menu {
  position: absolute;
  background: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
