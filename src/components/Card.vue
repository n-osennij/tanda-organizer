<template>
  <div class="card">
    <div class="card-header">
      <div>
        <span>{{ index + 1 }}</span>
        <span class="card-title">{{ card.title }}</span>
      </div>
      <small class="remove">
        <a href="#" @click.prevent="removeCard">убрать</a>
      </small>
    </div>
    <draggable
        :animation="150"
        :ghost-class="'sortable-ghost'"
        :model-value="card.items"
        group="list"
        item-key="id"
        @update:model-value="updateItemOrder"
    >
      <template #item="{element, index}">
        <ListItem :index="index" :item="element"/>
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import ListItem from './ListItem.vue';
import {useStore} from "../store";

export default {
  components: {
    draggable,
    ListItem,
  },
  props: {
    index: {
      type: Number,
      required: true,
    },
    card: {
      type: {
        id: String,
        title: String,
        items: Array,
      },
      required: true,
    },
  },
  setup() {
    const store = useStore();
    return {store};
  },
  methods: {
    updateItemOrder(newItems) {
      this.store.cards[this.index].items = [...newItems];
    },
    removeCard() {
      this.store.cards.splice(this.index, 1);
    }
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

.card-title {
  font-weight: bold;
  margin-left: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove a {
  color: #656565;
  text-decoration: none;
}
</style>
