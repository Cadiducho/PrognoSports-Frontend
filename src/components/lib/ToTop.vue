<template>
  <div
    v-show="show"
    class="is-fab p-4"
  >
    <o-tooltip
      label="Volver arriba"
      position="left"
      @click="scrollToTop"
    >
      <button class="button is-primary is-rounded">
        <span class="icon">
          <i class="fas fa-angle-up" />
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
    mounted() {
        window.addEventListener("scroll", (e) => {
            this.show = window.scrollY > this.scrollY;
        });
    },
    methods: {
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }
})
</script>

<style lang="scss" scoped>
.is-fab {
    position: fixed;
    bottom: 0;
    right: 16px;
}

.button {
    height: 48px;
}
</style>
