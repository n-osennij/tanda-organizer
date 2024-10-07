<template>
  <div class="my_header">
    <button @click="openFolder">Открыть папку</button>
    <button @click="addFolder">Добавить папку</button>
    <button @click="createEmptyCard">Создать пустую папку</button>
    <button @click="clearTitles">Очистить старые номера</button>
    <button @click="flatExport">Экспорт</button>
  </div>
</template>

<script>
import {v4 as uuid} from "uuid";
import { useStore } from '../store'

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
    }
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
  //box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.my_header button {
  margin-right: 3px;
}
</style>
