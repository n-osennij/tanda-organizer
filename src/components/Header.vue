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
import {v4 as uuidv4} from "uuid";

export default {
  name: 'Header',
  methods: {
    async openFolder() {
      try {
        const cards = await window.electron.ipcRenderer.invoke('open-folder');
        if (cards.length > 0) {
          this.$emit('folder-opened', cards);
        }
      } catch (error) {
        console.error('Ошибка при выборе папки:', error);
      }
    },
    async addFolder() {
      try {
        const cards = await window.electron.ipcRenderer.invoke('open-folder');
        if (cards.length > 0) {
          this.$emit('append-cards', cards);
        }
      } catch (error) {
        console.error('Ошибка при выборе папки:', error);
      }
    },
    createEmptyCard() {
      this.$emit('add-card', {
        id: uuidv4(),
        title: 'perfect tanda',
        items: []
      });
    },
    clearTitles() {
      this.$emit('clear-titles');
    },
    async flatExport() {
      this.$emit('export-files');
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
</style>
