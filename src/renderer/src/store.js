import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    cards: [],
    contextMenu: {
      visible: false,
      x: 0,
      y: 0,
      type: 0,
      context: Object,
    },
  }),
  getters: {},
  actions: {
    addCard(card) {
      this.cards.push(card);
    },
    addCards(cards) {
      for (const card of cards) {
        this.addCard(card);
      }
    },
    removeCard(index) {
      this.cards.splice(index, 1);
    },
    washTitle(title) {
      return title.replace(/^[^a-zA-Zа-яА-Я]*(?=[a-zA-Zа-яА-Я])/, "").trim();
    },
    clearTitles() {
      for (let card of this.cards) {
        card.title = this.washTitle(card.title);
        for (let item of card.items) {
          item.title = this.washTitle(item.title);
        }
      }
    },
    setCardItems(card_index, newItems) {
      this.cards[card_index].items = [...newItems];
    },
    openContextMenu(event, type, context) {
      const menu = this.contextMenu;
      menu.visible = true;
      menu.x = event.pageX;
      menu.y = event.pageY;
      menu.type = parseInt(type);
      menu.context = context;
    },
    closeContextMenu() {
      const menu = this.contextMenu;
      menu.visible = false;
      menu.x = 0;
      menu.y = 0;
      menu.type = 0;
      menu.context = Object;
    },
    markDuplicates() {
      const cards = this.cards;
      let titleCount = {};
      cards.forEach((card) => {
        card.items.forEach((item) => {
          item.duplicate = false;
          if (titleCount[item.title]) {
            titleCount[item.title]++;
          } else {
            titleCount[item.title] = 1;
          }
        });
      });
      cards.forEach((card) => {
        card.items.forEach((item) => {
          if (titleCount[item.title] > 1) {
            item.duplicate = true;
          }
        });
      });
    },
  },
});
