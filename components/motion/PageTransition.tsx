import { ViewTransition, type ReactNode } from "react";

/**
 * Wraps a page's content so route changes cross-fade with a small rise
 * (see `.page` rules in globals.css). Must live in page.tsx — layouts persist
 * across navigations, so their enter/exit never fire.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page" exit="page" default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
