// Bottom-nav tab link with active highlighting based on current route.
// Client Component so it can use usePathname.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavTabLinkProps {
    href: string;
    children: React.ReactNode;
}

export function NavTabLink({ href, children }: NavTabLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                "text-center py-3 text-sm font-semibold transition-colors relative",
                isActive
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]",
            )}
        >
            {children}
            {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-[var(--color-accent)] rounded-b-full" />
            )}
        </Link>
    );
}
