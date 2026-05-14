// Pre-trade checklist Server Actions. Pro-only (tier guard server-side).
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/features/billing/tier";

export interface ActionResult {
    ok: boolean;
    error?: string;
}

const MAX_ITEMS = 25;

async function authedUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return { user, supabase };
}

async function requirePro() {
    const tier = await getUserTier();
    if (!tier.isPaid) {
        return { ok: false as const, error: "Pre-trade checklist is a Pro feature. Upgrade to Pro to add items." };
    }
    return { ok: true as const };
}

export async function addChecklistItem(text: string): Promise<ActionResult> {
    const trimmed = text.trim();
    if (!trimmed) return { ok: false, error: "Item can't be empty." };
    if (trimmed.length > 200) return { ok: false, error: "Items are limited to 200 characters." };

    const proCheck = await requirePro();
    if (!proCheck.ok) return proCheck;

    const { user, supabase } = await authedUser();
    if (!user) return { ok: false, error: "Not signed in." };

    // Cap total items so users don't create absurdly long checklists.
    const { count } = await supabase
        .from("user_checklist_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
    if ((count ?? 0) >= MAX_ITEMS) {
        return { ok: false, error: `Up to ${MAX_ITEMS} checklist items.` };
    }

    // Append at the end (max position + 1).
    const { data: last } = await supabase
        .from("user_checklist_items")
        .select("position")
        .eq("user_id", user.id)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle();
    const nextPosition = (last?.position ?? 0) + 1;

    const { error } = await supabase
        .from("user_checklist_items")
        .insert({ user_id: user.id, text: trimmed, position: nextPosition });

    if (error) return { ok: false, error: error.message };

    revalidatePath("/calculator");
    return { ok: true };
}

export async function updateChecklistItem(id: string, text: string): Promise<ActionResult> {
    const trimmed = text.trim();
    if (!trimmed) return { ok: false, error: "Item can't be empty." };
    if (trimmed.length > 200) return { ok: false, error: "Items are limited to 200 characters." };

    const proCheck = await requirePro();
    if (!proCheck.ok) return proCheck;

    const { user, supabase } = await authedUser();
    if (!user) return { ok: false, error: "Not signed in." };

    const { error } = await supabase
        .from("user_checklist_items")
        .update({ text: trimmed })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/calculator");
    return { ok: true };
}

export async function deleteChecklistItem(id: string): Promise<ActionResult> {
    const proCheck = await requirePro();
    if (!proCheck.ok) return proCheck;

    const { user, supabase } = await authedUser();
    if (!user) return { ok: false, error: "Not signed in." };

    const { error } = await supabase
        .from("user_checklist_items")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/calculator");
    return { ok: true };
}

// Seed a Free → Pro user (or anyone with zero items) with a curated default
// checklist, so the empty state isn't paralyzing.
export async function seedDefaultChecklist(): Promise<ActionResult> {
    const proCheck = await requirePro();
    if (!proCheck.ok) return proCheck;

    const { user, supabase } = await authedUser();
    if (!user) return { ok: false, error: "Not signed in." };

    // Only seed if the user has no items yet (avoid duplicates on re-click).
    const { count } = await supabase
        .from("user_checklist_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
    if ((count ?? 0) > 0) return { ok: true };

    const defaults = [
        "Aligned with the higher-timeframe bias",
        "Risking ≤1% of account on this trade",
        "Outside the 30-min window around high-impact news",
        "Stop loss + take profit set before entry",
        "Following my plan — not chasing or revenge-trading",
        "Within my daily loss limit",
    ];

    const rows = defaults.map((text, i) => ({
        user_id: user.id,
        text,
        position: i + 1,
    }));

    const { error } = await supabase.from("user_checklist_items").insert(rows);
    if (error) return { ok: false, error: error.message };

    revalidatePath("/calculator");
    return { ok: true };
}
