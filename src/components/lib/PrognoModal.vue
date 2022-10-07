<template>
    <div class="modal is-active">
        <div class="modal-background" @click="close()"></div>
        <div class="modal-card">
            <form @submit.prevent="handle()">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        <slot name="title">
                            Modal title
                        </slot>
                    </p>
                    <a class="delete" @click="close()"></a>
                </header>
                <section class="modal-card-body">
                    <slot name="content">
                    </slot>
                </section>
                <footer class="modal-card-foot">
                    <slot name="footer">
                        <button class="button is-success" type="submit">Guardar cambios</button>
                        <button class="button" @click="close()">Cancelar</button>
                    </slot>
                </footer>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "PrognoModal",
    methods: {
        close() {
            console.log("close acas")
            this.$emit('close');
        },
        handle() {
            this.$emit('handle');
        }
    },
});
</script>