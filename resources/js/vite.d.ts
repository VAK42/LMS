import type { AxiosStatic } from 'axios';
declare global {
  interface ImportMeta {
    readonly glob: (pattern: string) => Record<string, () => Promise<any>>;
  }
  interface Window {
    axios: AxiosStatic;
  }
}
export { };