/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATA_DRAGON_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
