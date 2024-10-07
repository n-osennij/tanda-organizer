<template>
  <div id="container">
    <Header
        @folder-opened="updateCards"
        @append-cards="appendCards"
        @add-card="addCard"
        @clear-titles="clearTitles"
        @export-files="exportFiles"
    ></Header>
    <draggable
        v-model="cards"
        :animation="150"
        :ghost-class="'sortable-ghost'"
        group="cards"
        item-key="id"
        @end="updateCardOrder"
    >
      <template v-slot:item="{element, index}" :key="index">
        <Card
            :cards="cards"
            :index="index"
            :key="index"
            :items="element.items"
            :removeCard="() => removeCard(index)"
            :title="element.title"
            @update-item-order="updateItemOrder"
        />
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import Header from "./components/Header.vue";
import Card from "./components/Card.vue";
import {eventBus} from "./eventBus";
import {watch} from "vue";

export default {
  components: {
    Header,
    draggable,
    Card,
  },
  data() {
    return {
      cards: [],
    };
  },
  created() {
    // Слушаем изменения в eventBus
    watch(() => eventBus.move_data, (newData) => {
      this.moveItemToCard(newData.item, newData.to)
    });
    watch(() => eventBus.remove_data, (removeData) => {
      this.removeCardItem(removeData.item)
    });
  },
  methods: {
    updateCardOrder() {
      console.log('Updated card order:', this.cards);
    },
    updateItemOrder(items, cardIndex) {
      this.cards[cardIndex].items = [...items];
      console.log('Updated item order:', this.cards[cardIndex].items);
    },
    removeCard(index) {
      this.cards.splice(index, 1);
    },
    updateCards(structure) {
      this.cards = structure;
    },
    appendCards(cards) {
      for (const card of cards) {
        this.addCard(card);
      }
    },
    addCard(card) {
      this.cards.push(card);
    },
    moveItemToCard(item, card_index) {
      const xy = this.findItemIndexById(item.id);
      let target_card = this.cards[card_index];
      if (xy && target_card) {
        target_card.items.push(item);
        this.spliceItem(xy.cardIndex, xy.itemIndex)
      }
    },
    findItemIndexById(targetId) {
      for (let cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {
        const itemIndex = this.cards[cardIndex].items.findIndex(item => item.id === targetId);
        if (itemIndex !== -1) {
          return { cardIndex: cardIndex, itemIndex: itemIndex };
        }
      }
      return null;
    },
    spliceItem(card_id, item_id) {
      this.cards[card_id].items.splice(item_id, 1);
    },
    removeCardItem(item) {
      const xy = this.findItemIndexById(item.id);
      if (xy) {
        this.spliceItem(xy.cardIndex, xy.itemIndex)
      }
    },
    clearTitles() {
      for (let card of this.cards) {
        card.title = this.washTitle(card.title);
        for (let item of card.items) {
          item.title = this.washTitle(item.title);
        }
      }
    },
    washTitle(title) {
      return title.replace(/^[^a-zA-Zа-яА-Я]*(?=[a-zA-Zа-яА-Я])/, '').trim();
    },
    async exportFiles() {
      const cards = JSON.parse(JSON.stringify(this.cards));
      if (cards.length < 1) {
        console.log('nothing export')
        return;
      }
      try {
        await window.electron.ipcRenderer.invoke('export-files', cards)
      } catch (error) {
        console.log(error.message)
        return;
      }
      alert('Экспорт выполнен успешно')
    },
  },
};
</script>

<style scoped>
</style>
