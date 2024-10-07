import {defineStore} from 'pinia'

export const useStore = defineStore('store', {
    state: () => ({
        cards: [],
        contextMenu: {
            visible: false,
            x: 0,
            y: 0,
            content: "",
        },
        contextMenu2: {
            visible: false,
            x: 0,
            y: 0,
            content: "",
        }
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
            return title.replace(/^[^a-zA-Zа-яА-Я]*(?=[a-zA-Zа-яА-Я])/, '').trim();
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
        openContextMenu(event, content) {
            this.contextMenu.visible = true;
            this.contextMenu.x = event.clientX;
            this.contextMenu.y = event.clientY;
            this.contextMenu.content = content;
        },
        closeContextMenu() {
            this.contextMenu.visible = false;
            this.contextMenu.x = 0;
            this.contextMenu.y = 0;
            this.contextMenu.content = '';
        },
    },
})