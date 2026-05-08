// Server Actions for prop firm config.
// One upsert handles both "first save" and "edit" — the table is keyed by user_id.
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ConfigInput {
    preset: string;
    custom_account_size: number;
    custom_target: number;
    custom_max_loss: number;
    custom_daily: number;
    custom_trailing: number;
}

export interface ActionResult {
    ok: boolean;
    error?: string;
}

export async function savePropFirmConfig(input: ConfigInput): Promise<ActionResult> {
    const supabase = await createClient();
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return { ok: false, error: "Not signed in." };

    // Sanitize numeric fields (don't trust client floats).
    const safeNumber = (n: number) => (Number.isFinite(n) && n >= 0 ? n : 0);

    const { error } = await supabase
        .from("prop_firm_config")
        .upsert({
            user_id: user.id,
            preset: input.preset || "none",
            custom_account_size: safeNumber(input.custom_account_size),
            custom_target:       safeNumber(input.custom_target),
            custom_max_loss:     safeNumber(input.custom_max_loss),
            custom_daily:        safeNumber(input.custom_daily),
            custom_trailing:     safeNumber(input.custom_trailing),
        });

    if (error) return { ok: false, error: error.message };

    revalidatePath("/prop-firm");
    revalidatePath("/dashboard");
    return { ok: true };
}
