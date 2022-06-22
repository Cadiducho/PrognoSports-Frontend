import Oruga from "@oruga-ui/oruga-next";

declare module 'vue/types/vue' {
    interface Vue {
        $oruga: typeof Oruga;
    }
}