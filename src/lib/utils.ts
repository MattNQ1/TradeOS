// Tiny className combiner. Not pulling in clsx/tailwind-merge to keep deps minimal.
// Usage: cn("base-class", condition && "extra-class", { "active": isActive })
export function cn(...args: Array<string | false | null | undefined | Record<string, boolean>>): string {
    const out: string[] = [];
    for (const a of args) {
        if (!a) continue;
        if (typeof a === "string") {
            out.push(a);
        } else if (typeof a === "object") {
            for (const k of Object.keys(a)) if (a[k]) out.push(k);
        }
    }
    return out.join(" ");
}
