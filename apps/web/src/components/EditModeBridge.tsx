"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

// Inert for every real visitor; only activates when embedded in the admin's own-origin iframe.
export function EditModeBridge() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.self === window.top) return;
    document.documentElement.classList.add("hg-edit-mode");

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-edit]");
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      const link = el.querySelector<HTMLAnchorElement>("a[href]");
      window.parent.postMessage(
        {
          source: "hg-edit",
          kind: "edit",
          type: el.dataset.edit,
          id: el.dataset.editId,
          href: link ? new URL(link.href).pathname + new URL(link.href).search : null,
        },
        location.origin,
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (window.self === window.top) return;
    window.parent.postMessage(
      { source: "hg-edit", kind: "nav", path: `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}` },
      location.origin,
    );
  }, [pathname, searchParams]);

  return null;
}
