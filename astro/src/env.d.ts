/// <reference types="astro/client" />

declare global {
  namespace JSX {
    interface HTMLAttributes {
      itemProp?: string;
      itemScope?: boolean;
      itemType?: string;
    }
  }
}
