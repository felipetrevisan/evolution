"use client";

import { Collapse } from "animated-ui";
import type { ReactNode } from "react";

export function AnimatedCollapse({ children, open }: { children: ReactNode; open: boolean }) {
  return <Collapse isOpened={open}>{children}</Collapse>;
}
