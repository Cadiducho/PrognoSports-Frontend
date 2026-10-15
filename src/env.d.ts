/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_GIT_COMMIT_DATE: string;
    readonly VITE_GIT_BRANCH_NAME: string;
    readonly VITE_GIT_COMMIT_HASH: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
