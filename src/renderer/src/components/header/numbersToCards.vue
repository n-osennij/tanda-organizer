<template>
    <button :disabled="isDisabled" @click="numbersToCards">Номера в танды</button>
</template>

<script>
import {v4 as uuid} from "uuid";
import {useStore} from "../../store";

export default {
    name: "numbersToCards",
    setup() {
        const store = useStore();
        return {store};
    },
    props: {
        isDisabled: {
            type: Boolean,
            required: true,
        },
    },
    methods: {
        numbersToCards() {
            const res = confirm('Реорганизовать карточки, сделав номера в начале имен файлов тандами?');
            if (!res) {
                return;
            }

            const cards = this.store.cards;

            // Получаем все items из всех cards
            let items = [];
            for (const card of cards) {
                for (const item of card.items) {
                    items.push(item);
                }
            }

            // Пробуем получить из каждого item номер танды и порядковый номер внутри нее
            let tree = [];
            let homeless = []; // items, для которых не удалось найти танду и номер
            for (const item of items) {
                const title = item.title;
                const number = this.extractNumber(title);
                if (number) {
                    const xy = this.parseNumber(number);
                    if (xy && xy.length === 2) {
                        const tanda_number = xy[0];
                        const item_number = xy[1];
                        if (!tree[tanda_number]) {
                            tree[tanda_number] = [];
                        }
                        tree[tanda_number][item_number] = item;
                    } else {
                        homeless.push(item);
                    }
                } else {
                    homeless.push(item);
                }
            }

            this.store.cards = [
                ...this.prepareCards(tree),
                ...this.prepareCards([homeless], 'Мелодии без танды'),
            ];
        },
        prepareCards(tree, title = 'Идеальная танда') {
            let new_cards = [];
            for (const tanda_number in tree) {
                let items = tree[tanda_number];
                if (items && items.length > 0) {
                    items = items.filter(item => item !== undefined);
                }
                new_cards.push({
                    id: uuid(),
                    title: title,
                    items: items,
                })
            }
            return new_cards;
        },
        extractNumber(title) {
            const match = title.match(/^(\d+)[^\p{L}\p{N}]*(.*)$/u); //  цифры в начале строки
            return match ? match[1] : '';
        },
        parseNumber(number) {
            const match = number.match(/^\d{3}$/); // Проверяем, что строка состоит из 3 цифр
            if (match) {
                const tanda_number = parseInt(number.slice(0, 2)); // Первые две цифры
                const item_number = parseInt(number.slice(2));   // Третья цифра
                if (tanda_number < 1 || tanda_number > 99) {
                    return null;
                }
                if (item_number < 1 || item_number > 9) {
                    return null;
                }
                return [tanda_number, item_number];
            }
            return null;
        }
    },
};
</script>
