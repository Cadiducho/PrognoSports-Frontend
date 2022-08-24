<template>
    <div class="modal is-active">
        <div class="modal-background" @click="close()"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">
                    <slot name="title">
                        Modal title
                    </slot>
                </p>
                <button class="delete" aria-label="close" @click="close()"></button>
            </header>
            <section class="modal-card-body">
                <slot name="content">
                </slot>
            </section>
            <footer class="modal-card-foot">
                <slot name="footer">
                    <button class="button is-success" @click="save()">Guardar cambios</button>
                    <button class="button" @click="close()">Cancelar</button>
                </slot>
            </footer>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "PrognoModal",
    methods: {
        close() {
            this.$emit('close');
        },
        save() {
            this.$emit('save');
        },
    },
});
</script>