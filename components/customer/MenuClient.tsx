"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMenu } from "@/lib/useMenu";
import BrandHeader from "./BrandHeader";
import CategoryTabs from "./CategoryTabs";
import MenuSection from "./MenuSection";
import GoogleReviewCard from "./GoogleReviewCard";
import MenuFooter from "./MenuFooter";

// Single continuous menu: all categories stacked top-to-bottom. The sticky tab
// bar jumps to a category's section and stays in sync via scroll-spy.
export default function MenuClient() {
  const { data } = useMenu();

  const sections = useMemo(
    () =>
      data.categories
        .map((category) => ({
          category,
          products: data.products.filter(
            (p) => p.categoryId === category.id && p.isActive,
          ),
        }))
        .filter((s) => s.products.length > 0),
    [data],
  );

  const [activeId, setActiveId] = useState("");
  const sectionEls = useRef<Record<string, HTMLElement | null>>({});
  const isProgrammatic = useRef(false);

  // Default the active tab to the first section.
  useEffect(() => {
    if (sections.length && !sections.some((s) => s.category.id === activeId)) {
      setActiveId(sections[0].category.id);
    }
  }, [sections, activeId]);

  // Scroll-spy: activate the section nearest the top of the viewport.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammatic.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const id = visible[0]?.target.getAttribute("data-cat");
        if (id) setActiveId(id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    Object.values(sectionEls.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const handleSelect = (id: string) => {
    const el = sectionEls.current[id];
    if (!el) return;
    setActiveId(id);
    // Suppress the observer briefly so the tapped tab wins over scroll-spy.
    isProgrammatic.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      isProgrammatic.current = false;
    }, 700);
  };

  return (
    <>
      <BrandHeader />

      {sections.length === 0 ? (
        <p className="px-6 py-16 text-center text-sm text-ink-muted">
          Menü şu anda güncelleniyor. Lütfen kısa süre sonra tekrar deneyin.
        </p>
      ) : (
        <>
          <CategoryTabs
            categories={sections.map((s) => s.category)}
            activeId={activeId}
            onSelect={handleSelect}
          />

          <div>
            {sections.map((section, i) => (
              <MenuSection
                key={section.category.id}
                category={section.category}
                products={section.products}
                priorityFirst={i === 0}
                sectionRef={(el) => {
                  sectionEls.current[section.category.id] = el;
                }}
              />
            ))}
          </div>

          <GoogleReviewCard />
        </>
      )}

      <MenuFooter />
    </>
  );
}
