<template>
    <div class="my_header">
        <button @click="openFolder">Импорт</button>
        <button @click="addFolder">Добавить</button>
        <button @click="createEmptyCard">Создать папку</button>
        <button @click="clearTitles">Очистить номера</button>
        <button @click="flatExport">Экспорт списком</button>
    </div>
</template>

<script>
import {v4 as uuid} from "uuid";
import {useStore} from '../store'

export default {
    name: 'Header',
    setup() {
        const store = useStore();
        return {store};
    },
    methods: {
        async openFolder() {
            const cards = await window.electron.ipcRenderer.invoke('open-folder');
            if (cards && cards.length > 0) {
                this.store.cards = cards;
            }
        },
        async addFolder() {
            const cards = await window.electron.ipcRenderer.invoke('open-folder');
            if (cards.length > 0) {
                this.store.addCards(cards);
            }
        },
        createEmptyCard() {
            this.store.addCard({
                id: uuid(),
                title: 'perfect tanda',
                items: []
            })
        },
        clearTitles() {
            this.store.clearTitles();
        },
        async flatExport() {
            const cards = JSON.parse(JSON.stringify(this.store.cards));
            if (cards.length < 1) {
                console.log('nothing export')
                return;
            }
            await window.electron.ipcRenderer.invoke('export-files', cards)
            alert('Экспорт выполнен успешно')
        },
    },
};
</script>

<style scoped>
.my_header {
    position: sticky;
    top: 0;
    background-color: lightgray;
    padding: 5px;
    border: 1px solid #ddd;
    z-index: 1000;
    display: flex;
    justify-content: space-between; /* Распределяет кнопки */
    gap: 3px;
}

.my_header button {
    flex-grow: 1; /* Заставляет кнопки занимать равную ширину */
}
</style>
