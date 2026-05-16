// Bottom-nav tab link: icon stacked over a small label, with active-route
// highlighting + a top accent indicator.
//
// Client Component because it reads usePathname() to know which tab is active.
//
// Icons are inline SVG (no Lucide dep) — kept in this file so each tab is
// defined in one place. If the icon set grows, extract to its own module.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavTabLinkProps {
    href: string;
    label: string;
    icon: React.ReactNode;
}

export function NavTabLink({ href, label, icon }: NavTabLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
            className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-2.5 transition-colors",
                "active:scale-95 transition-transform duration-100",
                isActive
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-text-subtle)] hover:text-[var(--color-text)]",
            )}
        >
            {/* Top accent tick on the active tab */}
            {isActive && (
                <span
                    aria-hidden
                    className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 bg-[var(--color-accent)] rounded-b-full"
                />
            )}
            <span className="flex items-center justify-center w-5 h-5">
                {icon}
            </span>
            <span className="text-[10px] font-semibold leading-none tracking-wide">
                {label}
            </span>
        </Link>
    );
}

// ============================================================
// Tab icons — Lucide-style outlines, 20px @ stroke 2
// ============================================================

export function HomeIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

export function CalcIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="11" x2="8.01" y2="11" />
            <line x1="12" y1="11" x2="12.01" y2="11" />
            <line x1="16" y1="11" x2="16.01" y2="11" />
            <line x1="8" y1="15" x2="8.01" y2="15" />
            <line x1="12" y1="15" x2="12.01" y2="15" />
            <line x1="16" y1="15" x2="16.01" y2="15" />
            <line x1="8" y1="19" x2="8.01" y2="19" />
            <line x1="12" y1="19" x2="12.01" y2="19" />
            <line x1="16" y1="19" x2="16.01" y2="19" />
        </svg>
    );
}

export function JournalIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}

// Compass — "Coach" guides you through your patterns + checklist.
export function CoachIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
    );
}

// Shield — "Prop" tab guards against drawdown violations.
export function PropIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}

export function EconIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}
