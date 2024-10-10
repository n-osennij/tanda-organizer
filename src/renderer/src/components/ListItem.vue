<template>
    <li
        :class="{ clicked: isClicked }"
        :data-path="item.path"
        @contextmenu.prevent="openContextMenu($event, item)"
        @dblclick="openFile"
    >
        <span> {{ index + 1 }}. {{ item.title }} </span>
        <span class="marks">
      <small v-if="item.duplicate" class="duplicate-pill">дубль</small>
      <small v-if="item.marked" class="marked">*</small>
    </span>
    </li>
</template>

<script>
import {useStore} from "../store";

export default {
    props: {
        item: {
            type: {
                id: String,
                path: String,
                title: String,
            },
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        card_index: {
            type: Number,
            required: true,
        },
    },
    setup() {
        const store = useStore();
        return {store};
    },
    computed: {
        isClicked() {
            const context = this.store.contextMenu.context;
            if (context && context.item) {
                return context.item.id === this.item.id;
            }
        },
    },
    methods: {
        openContextMenu(event) {
            this.store.openContextMenu(event, 2, {
                card_index: parseInt(this.card_index),
                item_index: parseInt(this.index),
                item: this.item,
            });
        },
        async openFile() {
            await window.electron.ipcRenderer.invoke("open-file", this.item.path);
        },
    },
};
</script>

<style scoped>
li {
    list-style-type: none;
    margin-left: 18px;
    cursor: default;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.marks {
    display: flex;
    gap: 10px;
    padding-left: 15px;
}

li:hover {
    background-color: #dddddd;
}

.marked {
    color: red;
    font-weight: bold;
}

.duplicate-pill {
    background-color: red;
    color: white;
    padding: 0 4px;
    border-radius: 5px;
}

.clicked {
    background-color: #9e9e9e;
}
</style>
