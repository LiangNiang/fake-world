/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_PERSIST_STATE_VERSION_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
