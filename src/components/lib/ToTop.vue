<template>
    <div v-show="show" class="is-fab is-right p-4" @click="scrollToTop">

        <o-tooltip label="Volver arriba" position="left">
            <button class="button is-primary is-rounded">
                <span class="icon">
                    <i class="fas fa-angle-up"></i>
                </span>
            </button>
        </o-tooltip>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ToTop",
    props: {
        scrollY: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            show: false
        }
    },
    methods: {
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    },
    mounted() {
        window.addEventListener("scroll", (e) => {
            this.show = window.scrollY > this.scrollY;
        });
    }
})
</script>

<style lang="scss" scoped>
.is-fab {
    width: 100%;
    position: fixed;
    bottom: 0;
}

.is-right {
    display: flex;
    justify-content: end;
}

.button {
    height: 48px;
}
</style>
