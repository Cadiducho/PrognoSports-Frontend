<template>
    <PrognoModal @close="this.$emit('close')" @handle="toBlob()">
        <template v-slot:title><slot name="title"></slot></template>
        <template v-slot:content>
            <label class="label"><slot name="label"></slot></label>
            <cropper
                class="cropper"
                :src="blob"
                :min-height="minHeight"
                :min-width="minWidth"
                :stencil-component="stencilType"
                :stencil-props="stencilProps"
                :canvas="canvas"
                @change="onChange"
            ></cropper>
        </template>
    </PrognoModal>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, toRef} from "vue";
import {CircleStencil, Cropper, CropperResult, RectangleStencil} from "vue-advanced-cropper";
import PrognoModal from "@/components/lib/PrognoModal.vue";
import {useAuthStore} from "@/store/authStore";
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.bubble.css';

export default defineComponent({
    name: "UploadFileModal",
    components: {
        Cropper,
        CircleStencil,
        PrognoModal
    },
    props: {
        file: {
            type: Object as PropType <File> | null,
            required: false
        },
        format: {
            type: String,
            required: false,
            default: 'image/jpeg',
        },
        minHeight: {
            type: Number,
            default: 256
        },
        minWidth: {
            type: Number,
            default: 256
        },
        stencilComponent: {
            type: String as PropType<'circle' | 'rectangle'>,
            default: 'rectangle'
        },
        stencilProps: {
            type: Object,
            default() {
                return { aspectRatio: 1 };
            },
        },
        canvas: {
            type: [Object, Boolean],
            default: {
                maxWidth: 2048,
                maxHeight: 2048
            },
        },
    },
    emits: {
        close: null,
        submitFile: null
    },
    setup(props) {
        const authStore = useAuthStore();
        const currentUser = authStore.loggedUser;

        const file = toRef(props, 'file');
        const blob = computed(() => {
            if (file?.value != null) {
                return URL.createObjectURL(file.value);
            }
            return '';
        });

        const stencilType = computed(() => {
            if (props.stencilComponent === 'rectangle') {
                return RectangleStencil;
            }
            return CircleStencil;
        });

        return { currentUser, blob, stencilType };
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
        async toBlob() {
            this.selectedCanvas.toBlob((blob => {
                if (blob) {
                    this.$emit('submitFile', blob);

                    this.$emit('close');
                }
            }), this.format, 0.75);
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