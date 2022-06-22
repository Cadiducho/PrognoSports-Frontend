import {ref} from "vue";

export function useClipboard() {
    const supported = "clipboard" in navigator;
    const text = ref<string>();

    const writeText = (data: string) => {
        text.value = data;
        if (!supported) return Promise.resolve();

        return navigator.clipboard.writeText(data);
    };

    return {
        supported,
        text,
        writeText,
    };
}