<template>
    <div class="flex items-center select-none">
        <input
            type="checkbox"
            v-model="darkMode"
            class="switch"
            id="switch"
            :checked="darkMode"
            @change="switchTheme"
        />
        <label for="switch" class="label bg-gray-600 dark:bg-gray-200 cursor-pointer">
            <span class="">🌑</span>
            <span class="">☀️</span>
            <div class="ball dark:bg-gray-600 bg-gray-200"></div>
        </label>
    </div>
</template>

<style lang="css" scoped>
.switch {
    position: absolute;
    opacity: 0;
}

.switch:checked + .label .ball {
    transform: translateX(24px);
}

.switch + .ball {
    top: 0;
    left: 0;
}

.label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 50px;
    position: relative;
    padding: 2px;
    height: 26px;
    width: 50px;
}

.ball {
    border-radius: 50%;
    height: 22px;
    width: 22px;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s linear;
}
</style>

<script lang="ts">
// Autor: @Eschiclers https://github.com/Eschiclers/eschiclers.github.io
import {defineComponent} from "vue";

export default defineComponent({
    name: "SwitchTheme",
    data() {
        return {
            darkMode: false,
        };
    },
    methods: {
        switchTheme() {
            if (this.darkMode) {
                window.localStorage.setItem("dark", "true");
                document.documentElement.classList.add("dark");
            } else {
                window.localStorage.setItem("dark", "false");
                document.documentElement.classList.remove("dark");
            }
        },
    },
    mounted() {
        if (window.localStorage.getItem("dark") === null) {
            window.localStorage.setItem("dark", "false");
        } // First load (have not theme saved)
        if (window.localStorage.getItem("dark") === "true") {
            this.darkMode = true;
            document.documentElement.classList.add("dark");
        } else {
            this.darkMode = false;
            document.documentElement.classList.remove("dark");
        }
    },
});
</script>