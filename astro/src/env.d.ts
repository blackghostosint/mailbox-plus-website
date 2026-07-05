/// <reference types="astro/client" />

declare module '~icons/lucide/*' {
  import type { ComponentType, SVGProps } from 'react';
  const component: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
  export default component;
}

declare global {
  namespace JSX {
    interface HTMLAttributes {
      itemProp?: string;
      itemScope?: boolean;
      itemType?: string;
    }
  }
}
