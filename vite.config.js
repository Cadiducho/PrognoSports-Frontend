import { defineConfig } from 'vite'
import { createVuePlugin as vue } from "vite-plugin-vue2";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'], //FixMe: Eliminar estas extensiones, añadir .vue a todas los imports en componentes
    },
})