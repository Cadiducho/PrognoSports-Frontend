<template>
    <PrognoModal @close="this.$emit('close')" @handle="uploadFile()">
        <template v-slot:title>Cambiar imagen de perfil</template>
        <template v-slot:content>
            <label class="label">¿Quieres cambiar tu imagen de perfil?</label>
            <cropper
                class="cropper"
                :src="blob"
                :min-height="256"
                :min-width="256"
                :stencil-component="$options.components.CircleStencil"
                :stencil-props="{
                    aspectRatio: 1
                }"
                :canvas="{
                    maxWidth: 2048,
                    maxHeight: 2048,
                }"
                @change="onChange"
            ></cropper>
        </template>
    </PrognoModal>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, toRef} from "vue";
import {CircleStencil, Coordinates, Cropper, CropperResult} from 'vue-advanced-cropper';
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {notificationService, userService} from "@/_services";
import {useAuthStore} from "@/store/authStore";
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.bubble.css';

export default defineComponent({
    name: "ChangeImageModal",
    components: {
        Cropper,
        CircleStencil,
        PrognoModal
    },
    props: {
        file: {
            type: Object as PropType <File> | null,
            required: true
        },
    },
    setup(props) {
        const authStore = useAuthStore();
        const currentUser = authStore.loggedUser;

        const file = toRef(props, 'file');
        const blob =  computed(() => {
            if (file?.value != null) {
                return URL.createObjectURL(file.value);
            }
            return '';
        });

        return { currentUser, blob };
    },
    data() {
        return {
            selectedCanvas: {} as HTMLCanvasElement,
        }
    },
    methods: {
        onChange(cropperResult: CropperResult) {
            if (cropperResult.canvas) {
                this.selectedCanvas = cropperResult.canvas;
            }
        },
        async uploadFile() {
            this.selectedCanvas.toBlob((blob => {
                if (blob) {
                    if (blob.size > 2_097_152) {
                        notificationService.showNotification("El archivo escogido es demasiado grande. El tamaño máximo es de 2Mb.", "danger");
                        return;
                    }

                    userService.changeProfileImage(this.currentUser, blob).then(() => {
                        notificationService.showNotification("¡Has cambiado tu imagen de perfil!");

                        this.$emit('close');
                    }).catch(() => {
                        notificationService.showNotification("Ha ocurrido un error cambiado tu imagen de perfil", "danger");
                    });
                }

            }), 'image/jpeg', 0.75);
        }
    },
});
</script>

<style scoped>
.cropper {
    height: calc(100% - 0.1rem);
    background: #DDD;
}
</style>