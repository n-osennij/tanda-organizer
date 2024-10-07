<template>
  <div :data-index="index" class="card" :key="index">
    <div class="hb">
      <div class="ch">
        <span>{{ index + 1 }}</span>
        <span class="card-header">{{ title }}</span>
      </div>
      <div class="cd">
        <small>
          <a class="del" href="#" @click.prevent="removeCard">убрать</a>
        </small>
      </div>
    </div>
    <draggable
        :animation="150"
        :ghost-class="'sortable-ghost'"
        :model-value="items"
        group="list"
        item-key="name"
        @update:model-value="updateItemOrder"
    >
      <template #item="{element, index}">
        <ListItem :cards="cards" :index="index" :item="element" :key="index"/>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListItem from './ListItem.vue';

export default {
  components: {
    draggable,
    ListItem,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeCard: {
      type: Function,
      required: true,
    },
    cards: {
      type: Array,
      required: true,
    },
  },
  methods: {
    updateItemOrder(newItems) {
      this.$emit('update-item-order', newItems, this.index); // Передаем новый массив и index
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  margin-top: 10px;
  padding: 5px;
}

.card-header {
  font-weight: bold;
  margin-left: 10px;
}

.hb {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ch {
  display: flex;
  align-items: center;
}

.cd a {
  color: #656565;
  text-decoration: none;
}
</style>
