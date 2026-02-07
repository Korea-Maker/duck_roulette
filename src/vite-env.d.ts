/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DDRAGON_VERSION?: string;
  readonly VITE_DDRAGON_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
