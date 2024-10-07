import {reactive} from 'vue';

export const eventBus = reactive({
    activeMenu: null, // Отслеживаем активное меню
    closeMenu() {
        if (this.activeMenu) {
            this.activeMenu(); // Закрываем текущее активное меню
        }
        this.activeMenu = null;
    },
    moveTo(data) {
        this.move_data = data;
    },
    removeItem(data) {
        this.remove_data = data;
    },
});
