"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Markiert, dass JS aktiv ist -> erst dann werden .reveal-Elemente
    // versteckt und eingeblendet. Ohne JS bleibt alles sichtbar.
    document.documentElement.classList.add("js");

    const els = document.querySelectorAll(".reveal:not(.visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
