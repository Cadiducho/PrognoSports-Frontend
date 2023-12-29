import { defineConfig } from 'vite'
import { fileURLToPath } from "url";
import vue from '@vitejs/plugin-vue'
import { execSync } from "child_process";

export default defineConfig(({ command, mode }) => {
    const commitDate = execSync('git log -1 --format=%cI').toString().trimEnd();
    const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trimEnd();
    const commitHash = execSync('git rev-parse --short HEAD').toString().trimEnd();

    process.env.VITE_GIT_COMMIT_DATE = commitDate;
    process.env.VITE_GIT_BRANCH_NAME = branchName;
    process.env.VITE_GIT_COMMIT_HASH = commitHash;

    return {
        plugins: [
            vue(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            },
        },
    }
})