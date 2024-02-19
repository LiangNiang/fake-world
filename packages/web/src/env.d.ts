/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PERSIST_STATE_VERSION_KEY: string;
  readonly VITE_PERSIST_STATE_GLOBAL_KEY: string;
  readonly VITE_PERSIST_STATE_SHARE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
