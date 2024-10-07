<template>
  <div
      v-if="visible"
      ref="menu"
      :style="{ top: position.top + 'px', left: position.left + 'px' }"
      class="context-menu"
  >
    <div>
      <div>Переместить в танду №:</div>
      <div class="tanda_buttons">
        <button
            v-for="(card, index) in cards"
            :key="index"
            @click="moveTo(index)"
            :title="card.title"
        >
          {{ index + 1 }}
        </button>
      </div>
    </div>
    <ul>
      <li @click="openFile">Play</li>
      <li @click="removeFile">Delete</li>
    </ul>
  </div>
</template>

<script>
import {eventBus} from '../eventBus';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    cards: {
      type: Array,
      required: true,
    },
    visibleSync: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      position: {top: 0, left: 0},
    };
  },
  methods: {
    showMenu(x, y) {
      this.position = {top: y, left: x};
      this.visible = true;
      this.$emit('update-visible', true);

      eventBus.closeMenu(); // Закрыть все остальные меню
      eventBus.activeMenu = this.hideMenu; // Зарегистрировать текущее меню как активное
    },
    hideMenu() {
      this.visible = false;
      this.$emit('update-visible', false);
    },
    onAction(action) {
      this.$emit('menu-action', action, this.item);
      this.hideMenu();
    },
    async openFile(){
      try {
        await window.electron.ipcRenderer.invoke('open-file', this.item.path);
      } catch (error) {
        console.error('Ошибка при выборе папки:', error);
      }
      this.hideMenu();
    },
    handleClickOutside(event) {
      if (this.$refs.menu && !this.$refs.menu.contains(event.target)) {
        this.hideMenu();
      }
    },
    removeFile() {
      eventBus.removeItem({
        item: this.item,
      });
    },
    moveTo(index) {
      eventBus.moveTo({
        item: this.item,
        to: index,
      });
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style scoped>
.context-menu {
  position: absolute;
  background-color: #fff;
  border: 1px solid #a8a8a8;
  padding: 5px;
  z-index: 1000;
  max-width: 250px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.context-menu li {
  padding: 2px 5px;
  cursor: pointer;
}

.context-menu li:hover {
  background-color: #ddd;
}

.tanda_buttons {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 5px;
}

.tanda_buttons button {
  flex: 1 1 auto;
  margin: 1px;
}
</style>
