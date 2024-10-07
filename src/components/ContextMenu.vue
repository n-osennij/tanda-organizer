<template>
  <div v-if="menu.visible"
       :style="{ top: menu.y + 'px', left: menu.x + 'px' }"
       class="context-menu"
       @click.stop
  >
    <div v-if="menu.type === 1">
      <span>Сделайть танду n-ой:</span>
      <div class="card-buttons">
        <button v-for="(card, index) in store.cards" @click="moveCard(index)">
          {{ index + 1 }}
        </button>
      </div>
    </div>
    <div v-if="menu.type === 2">
      <span>Переместить в танду:</span>
      <div class="card-buttons">
        <button v-for="(card, index) in store.cards" @click="moveItemToCard(index)">
          {{ index + 1 }}
        </button>
      </div>
    </div>
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
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    handleClickOutside() {
      this.store.closeContextMenu();
    },
    moveItemToCard(target_card_index) {
      const {type, context} = this.menu;
      if (type !== 2 || !context) {
        return;
      }

      const {card_index, item_index, item} = context;
      if (card_index === undefined || item_index === undefined || !item) {
        return;
      }

      const target_card = this.store.cards[target_card_index];
      if (target_card) {
        target_card.items.push(item);
        this.spliceItem(card_index, item_index);
      }

      this.handleClickOutside();
    },
    spliceItem(card_id, item_id) {
      this.store.cards[card_id].items.splice(item_id, 1);
    },
    moveCard(to) {
      const {type, context} = this.menu;
      if (type !== 1 || !context) {
        return;
      }

      const from = context.card_index;
      const cards = this.store.cards;
      if (from < 0 || from >= cards.length || to < 0 || to >= cards.length) {
        return;
      }
      const [movedItem] = cards.splice(from, 1); // Удаляем объект с позиции `from`
      cards.splice(to, 0, movedItem); // Вставляем объект на позицию `to`

      this.handleClickOutside();
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
  max-width: 220px;
  width: 100%;
}

.card-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  background-color: white;
}

.card-buttons button {
  flex-grow: 1;
}
</style>
