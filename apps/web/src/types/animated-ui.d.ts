declare module "animated-ui" {
  import type { ComponentType, ReactNode } from "react";

  export const Collapse: ComponentType<{ children: ReactNode; isOpened?: boolean }>;
}
