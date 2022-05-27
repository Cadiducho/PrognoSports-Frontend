import Oruga from "@oruga-ui/oruga";

declare module 'vue/types/vue' {
    interface Vue {
        $oruga: typeof Oruga;
    }
}