import {defineStore} from 'pinia'

export const useStore = defineStore('store', {
    state: () => ({
        cards: [],
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
    },
})