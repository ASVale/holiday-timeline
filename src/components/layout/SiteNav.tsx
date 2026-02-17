"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navLinks = [
  { href: "/holidays", label: "Holidays" },
  { href: "/cv", label: "CV", comingSoon: true },
  { href: "/projects", label: "Projects", comingSoon: true },
  { href: "/personal", label: "Personal", comingSoon: true },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-800 bg-surface/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-accent">
              World Timeline
            </Link>
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.comingSoon ? "#" : link.href}
                  className={clsx(
                    "text-sm font-medium transition-colors",
                    pathname?.startsWith(link.href)
                      ? "text-accent"
                      : link.comingSoon
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-300 hover:text-accent"
                  )}
                  onClick={(e) => link.comingSoon && e.preventDefault()}
                >
                  {link.label}
                  {link.comingSoon && (
                    <span className="ml-2 text-xs text-gray-600">
                      Coming Soon
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
