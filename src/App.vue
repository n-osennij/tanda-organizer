<template>
    <div id="container">
        <Header/>
        <Cards/>
        <ContextMenu/>
        <About v-if="store.cards.length < 1"/>
    </div>
</template>
<script>
import Header from "./components/Header.vue";
import Cards from "./components/Cards.vue";
import ContextMenu from "./components/ContextMenu.vue";
import About from "./components/About.vue";
import {useStore} from "./store";

export default {
    components: {
        Header,
        Cards,
        ContextMenu,
        About,
    },
    setup() {
        const store = useStore();
        return {store};
    },
};
</script>
