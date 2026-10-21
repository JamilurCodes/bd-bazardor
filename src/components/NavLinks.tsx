
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  id: string | number;
  slug: string;
  nameBn: string;
  icon?: string;
}

const CATEGORIES_API =
  "https://openapi.programming-hero.com/api/bazardor/categories";

const FALLBACK_ICONS: Record<string, string> = {
  chal: "🍚",
  dal: "🫘",
  tel: "🛢️",
  sobji: "🥬",
  mach: "🐟",
  mangsho: "🍗",
  dim_dudh: "🥛",
  mosla: "🌶️",
};

function getCategoryIcon(category: Category) {
  if (category.icon) return category.icon;

  const key = `${category.slug} ${category.nameBn}`.toLowerCase();

  if (/chal|চাল/.test(key)) return "🍚";
  if (/dal|ডাল/.test(key)) return "🫘";
  if (/tel|তেল/.test(key)) return "🛢️";
  if (/sobji|সবজি/.test(key)) return "🥬";
  if (/mach|মাছ/.test(key)) return "🐟";
  if (/mangsho|মাংস/.test(key)) return "🍗";
  if (/dim|dudh|ডিম|দুধ/.test(key)) return "🥛";
  if (/mosla|মসলা/.test(key)) return "🌶️";

  return FALLBACK_ICONS[category.slug] ?? "🛒";
}

const NavLinks = () => {
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await fetch(CATEGORIES_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Category request failed: ${response.status}`);
        }

        const result: unknown = await response.json();

        // Accept either { data: [...] } or a direct array.
        const payload = Array.isArray(result)
          ? result
          : result &&
              typeof result === "object" &&
              "data" in result &&
              Array.isArray(result.data)
            ? result.data
            : [];

        const normalized: Category[] = payload.flatMap((item) => {
          if (!item || typeof item !== "object") return [];

          const value = item as Record<string, unknown>;

          const slug = value.slug;
          const nameBn =
            value.nameBn ?? value.name_bn ?? value.name_bn_name;

          if (
            typeof slug !== "string" ||
            typeof nameBn !== "string"
          ) {
            return [];
          }

          return [
            {
              id:
                typeof value.id === "string" ||
                typeof value.id === "number"
                  ? value.id
                  : slug,
              slug,
              nameBn,
              icon:
                typeof value.icon === "string"
                  ? value.icon
                  : undefined,
            },
          ];
        });

        if (!controller.signal.aborted) {
          setCategories(normalized);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Unable to load categories:", error);
        }
      }
    }

    void loadCategories();

    return () => controller.abort();
  }, []);

  const linkClass =
    "inline-flex shrink-0 items-center gap-2 whitespace-nowrap py-3 text-sm font-medium text-[#28332b] transition-colors hover:text-[#078640]";

  return (
    <nav
      aria-label="পণ্যের বিভাগ"
      className="flex items-center gap-6 overflow-x-auto"
    >
      <Link
        href="/"
        aria-current={pathname === "/" ? "page" : undefined}
        className={`${linkClass} ${
          pathname === "/" ? "text-[#078640]" : ""
        }`}
      >
        <span aria-hidden="true">🏠</span>
        <span>হোম</span>
      </Link>

      {categories.map((category) => {
        const href = `/category/${category.slug}`;

        const active =
          pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={category.id}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`${linkClass} ${
              active ? "text-[#078640]" : ""
            }`}
          >
            <span aria-hidden="true">
              {getCategoryIcon(category)}
            </span>
            <span>{category.nameBn}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavLinks;
