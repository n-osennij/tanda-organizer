<template>
    <div class="my_header">
        <button :disabled="isDialog" @click="openFolder">Импорт</button>
        <button :disabled="isDialog || isNoCards" @click="addFolder">Добавить</button>
        <button :disabled="isNoCards" @click="createEmptyCard">Создать танду</button>
        <NumbersToCards :is-disabled="isNoCards"/>
        <button :disabled="isNoCards" @click="clearTitles">Очистить номера</button>
        <button :disabled="isDialog || isNoCards" @click="flatExport">Экспорт списком</button>
        <button @click="about">?</button>
    </div>
</template>

<script>
import {v4 as uuid} from "uuid";
import {useStore} from "../store";
import NumbersToCards from "./header/numbersToCards.vue";

export default {
    name: "Header",
    components: {NumbersToCards},
    setup() {
        const store = useStore();
        return {store};
    },
    data() {
        return {
            isDialog: false,
        };
    },
    computed: {
        isNoCards() {
            return this.store.cards.length < 1;
        },
    },
    methods: {
        async openFolder() {
            this.isDialog = true;
            const cards = await window.electron.ipcRenderer.invoke("open-folder");
            if (cards && cards.length > 0) {
                this.store.cards = cards;
            }
            this.store.markDuplicates();
            this.isDialog = false;
        },
        async addFolder() {
            this.isDialog = true;
            const cards = await window.electron.ipcRenderer.invoke("open-folder");
            if (cards.length > 0) {
                this.store.addCards(cards);
            }
            this.store.markDuplicates();
            this.isDialog = false;
        },
        createEmptyCard() {
            this.store.addCard({
                id: uuid(),
                title: "Идеальная танда",
                items: [],
            });
        },
        clearTitles() {
            this.store.clearTitles();
            this.store.markDuplicates();
        },
        async flatExport() {
            this.isDialog = true;
            const cards = JSON.parse(JSON.stringify(this.store.cards));
            if (cards.length < 1) {
                alert("Нет ни одной танды для экспорта")
                this.isDialog = false;
                return;
            }
            await window.electron.ipcRenderer
                .invoke("export-files", cards)
                .then(function () {
                    alert("Экспорт выполнен успешно");
                }).catch(function (err) {
                    alert("Во время экспорта что-то пошло не так - " + err);
                    console.log(err);
                });
            this.isDialog = false;
        },
        about() {
            window
                .open("https://github.com/n-osennij/tanda-organizer", "_blank")
                .focus();
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
