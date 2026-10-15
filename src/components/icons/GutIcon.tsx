import type { SVGProps } from "react";

/** Silhueta de intestino — usa currentColor para seguir a paleta do app. */
export function GutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M8 3c-2.5 0-4 2-4 4s1.5 3.5 4 3.5 4 1.5 4 3.5-1.5 4-4 4" />
      <path d="M16 3c2.5 0 4 2 4 4s-1.5 3.5-4 3.5-4 1.5-4 3.5 1.5 4 4 4" />
      <path d="M8 21v-3" />
      <path d="M16 21v-3" />
    </svg>
  );
}
