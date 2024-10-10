<template>
    <div
        v-if="menu.visible"
        :style="{ top: menu.y + 'px', left: menu.x + 'px' }"
        class="context-menu"
        @click.stop
    >
        <!-- Клик по заголовку карточки/танды -->
        <div v-if="menu.type === 1">
            <div v-if="store.cards.length > 1" class="buttons-div">
                <span>Сделайть танду n-ой:</span>
                <div class="card-buttons">
                    <button v-for="(card, index) in store.cards" @click="moveCard(index)">
                        {{ index + 1 }}
                    </button>
                </div>
            </div>
            <ul class="items-menu">
                <li @click="mark">Пометка</li>
                <li @click="removeCard">Убрать</li>
            </ul>
        </div>
        <!-- Клик по элементу карточки/мелодии -->
        <div v-if="menu.type === 2">
            <div v-if="store.cards.length > 1" class="buttons-div">
                <span>Переместить в танду:</span>
                <div class="card-buttons">
                    <button
                        v-for="(card, index) in store.cards"
                        :class="{ marked: card.marked }"
                        @click="moveItemToCard(index)"
                    >
                        {{ index + 1 }}
                    </button>
                </div>
            </div>
            <ul class="items-menu">
                <li @click="openFile">Открыть</li>
                <li @click="mark">Пометка</li>
                <li @click="show">Показать</li>
                <li @click="removeCardItem">Убрать</li>
            </ul>
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
        document.addEventListener("click", this.handleClickOutside);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.handleClickOutside);
    },
    methods: {
        handleClickOutside() {
            this.store.closeContextMenu();
        },
        moveItemToCard(target_card_index) {
            if (!this.checkItemContext()) {
                return;
            }
            const {card_index, item_index, item} = this.menu.context;
            const target_card = this.store.cards[target_card_index];
            if (target_card) {
                target_card.items.push(item);
                this.spliceItem(card_index, item_index);
            }

            this.handleClickOutside();
        },
        checkItemContext() {
            const {type, context} = this.menu;
            if (type !== 2 || !context) {
                return false;
            }

            const {card_index, item_index, item} = context;
            return !(card_index === undefined || item_index === undefined || !item);
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
            const [movedItem] = cards.splice(from, 1); // Удаляем объект с позиции from
            cards.splice(to, 0, movedItem); // Вставляем объект на позицию to

            this.handleClickOutside();
        },
        removeCard() {
            const {type, context} = this.menu;
            if (type !== 1 || !context) {
                return;
            }
            this.store.removeCard(context.card_index);
            this.handleClickOutside();
            this.store.markDuplicates();
        },
        removeCardItem() {
            if (!this.checkItemContext()) {
                return;
            }
            const {card_index, item_index} = this.menu.context;
            this.spliceItem(card_index, item_index);
            this.handleClickOutside();
            this.store.markDuplicates();
        },
        async openFile() {
            if (!this.checkItemContext()) {
                return;
            }
            const item = this.menu.context.item;
            await window.electron.ipcRenderer.invoke("open-file", item.path);
            this.handleClickOutside();
        },
        mark() {
            const item = this.menu.context.item;
            item.marked = !item.marked ?? true;
            this.handleClickOutside();
        },
        async show() {
            if (!this.checkItemContext()) {
                return;
            }
            const item = this.menu.context.item;
            await window.electron.ipcRenderer.invoke(
                "show-file-in-folder",
                item.path,
            );
            this.handleClickOutside();
        },
    },
};
</script>

<style scoped>
.context-menu {
    position: absolute;
    background: #fff;
    border: 1px solid #ccc;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 220px;
    width: 100%;
}

.buttons-div {
    margin-bottom: 5px;
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

.items-menu {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.items-menu li {
    display: block;
    padding: 2px 0;
}

.items-menu li:hover {
    background-color: #ddd;
}

.marked {
    color: #ff9800;
    font-weight: bold;
}
</style>
